import logging
from typing import Optional, Dict, Any, List
import httpx
from app.models.report import Report
from app.models.user import User
from app.config import settings

logger = logging.getLogger("app.ai_service")

class AIService:

    @staticmethod
    async def get_team_members() -> List[str]:
        try:
            users = await User.find_all().to_list()
            # Filter only active team members (excluding admin/manager unless specifically asked)
            members = [u.name for u in users if getattr(u, 'role', 'member') == 'member']
            # Fallback to unique user names if no 'member' role found
            if not members:
                members = list(set([u.name for u in users if u.role not in ['admin', 'manager']]))
            return sorted(list(set(members)))
        except Exception as e:
            logger.warning(f"Error fetching users for AI context: {e}")
            return ["Sarah Chen", "Marcus Vance", "Elena Rostova"]

    @staticmethod
    async def build_report_context(week_start_date: Optional[str] = None) -> str:
        query = {}
        if week_start_date:
            query["week_start_date"] = week_start_date
        
        reports = await Report.find(query).sort("-created_at").limit(15).to_list()
        
        if not reports:
            return "No report data currently available in the system."

        context_lines = []
        for r in reports:
            line = f"- Member: {r.user_name} | Week: {r.week_start_date} | Status: {r.status} | Project: {r.project_name or 'N/A'}"
            if r.content:
                tasks_cnt = len(r.content.tasks_completed)
                line += f" | Tasks Completed: {tasks_cnt}"
                
                key_achievements = [a.text for a in r.content.achievements if a.is_key_achievement]
                if key_achievements:
                    line += f" | Key Achievements: {'; '.join(key_achievements)}"
                
                key_blockers = [b.text for b in r.content.blockers if b.is_key_issue]
                if key_blockers:
                    line += f" | Key Blockers: {'; '.join(key_blockers)}"
            context_lines.append(line)

        return "\n".join(context_lines)

    @classmethod
    async def chat(cls, prompt: str, week_start_date: Optional[str] = None) -> str:
        prompt_lower = prompt.lower()
        member_names = await cls.get_team_members()
        report_context = await cls.build_report_context(week_start_date)

        # Check if the user is asking about user count or team member lists
        is_user_count_query = any(k in prompt_lower for k in [
            "how many user", "how many member", "how many people", "user count",
            "member count", "list user", "list member", "who are in", "users in application",
            "members in application", "who are the members", "who are the users", "total users"
        ])

        if is_user_count_query:
            count = len(member_names)
            members_list = "\n".join([f"{idx + 1}. **{name}**" for idx, name in enumerate(member_names)])
            return f"There are **{count} team members** currently active in the application:\n\n{members_list}"

        system_instructions = (
            "You are ProgressHub Assistant, an intelligent team AI assistant for an engineering manager. "
            "Respond with native human fluency, natural phrasing, high clarity, and a warm professional tone. "
            "When asked about team users or members, state the exact count of active team members (engineers) and list their names clearly. "
            "Do not include admin accounts or manager roles in user member lists unless explicitly asked. "
            "Do not output raw database dumps, repeated key-value pairs, or ': 0' metrics. Keep responses polished, friendly, and direct."
        )
        
        full_prompt = (
            f"Team Context:\n"
            f"Active Team Members (Count: {len(member_names)}): {', '.join(member_names)}\n\n"
            f"Recent Reports Context:\n{report_context}\n\n"
            f"Manager Question: {prompt}"
        )

        # 1. Check if Grok API Key is provided
        if settings.GROK_API_KEY:
            try:
                async with httpx.AsyncClient(timeout=15.0) as client:
                    resp = await client.post(
                        "https://api.x.ai/v1/chat/completions",
                        headers={
                            "Authorization": f"Bearer {settings.GROK_API_KEY}",
                            "Content-Type": "application/json"
                        },
                        json={
                            "model": settings.GROK_MODEL or "grok-beta",
                            "messages": [
                                {"role": "system", "content": system_instructions},
                                {"role": "user", "content": full_prompt}
                            ],
                            "temperature": 0.3
                        }
                    )
                    if resp.status_code == 200:
                        data = resp.json()
                        return data["choices"][0]["message"]["content"]
                    else:
                        logger.warning(f"Grok API returned status {resp.status_code}: {resp.text}")
            except Exception as e:
                logger.warning(f"Failed to connect to Grok API: {e}")

        # 2. Try Local Ollama endpoint
        base_url = settings.OLLAMA_BASE_URL.rstrip('/')
        ollama_gen_url = f"{base_url}/api/generate"
        ollama_tags_url = f"{base_url}/api/tags"
        
        try:
            async with httpx.AsyncClient(timeout=25.0) as client:
                target_model = settings.OLLAMA_MODEL or "qwen2:0.5b"
                try:
                    tags_resp = await client.get(ollama_tags_url)
                    if tags_resp.status_code == 200:
                        installed_models = [m.get("name") for m in tags_resp.json().get("models", [])]
                        if installed_models and target_model not in installed_models:
                            target_model = installed_models[0]
                except Exception as ex:
                    logger.debug(f"Tags query error: {ex}")
                
                resp = await client.post(
                    ollama_gen_url,
                    json={
                        "model": target_model,
                        "system": system_instructions,
                        "prompt": full_prompt,
                        "stream": False
                    }
                )
                if resp.status_code == 200:
                    data = resp.json()
                    res_text = data.get("response", "").strip()
                    if res_text:
                        return res_text
                else:
                    logger.warning(f"Ollama returned status code {resp.status_code}: {resp.text}")
        except Exception as e:
            logger.info(f"Ollama local instance not reachable at {ollama_gen_url} ({e}). Using intelligent summary fallback.")

        # 3. Fallback: Intelligent summary generation
        return cls._generate_fallback_summary(prompt, report_context, member_names)

    @staticmethod
    def _generate_fallback_summary(prompt: str, context: str, member_names: List[str]) -> str:
        prompt_lower = prompt.lower()
        if "blocker" in prompt_lower or "issue" in prompt_lower:
            return f"**Blocker Analysis Summary** based on current team reports:\n\n{context}\n\n*Recommendation*: Focus review on team members with key issues flagged above."
        elif "achievement" in prompt_lower or "completed" in prompt_lower or "progress" in prompt_lower:
            return f"**Team Progress & Achievements Summary**:\n\n{context}\n\n*Highlights*: Review key achievements and completed tasks listed for each member."
        else:
            members_list = ", ".join(member_names) if member_names else "Sarah Chen, Marcus Vance, Elena Rostova"
            return f"**ProgressHub Assistant Response**:\n\nBased on current reports for our {len(member_names)} team members ({members_list}):\n\n{context}"

