import logging
import re
from typing import Optional, Dict, Any, List
import httpx
from app.models.report import Report
from app.models.user import User
from app.config import settings

logger = logging.getLogger("app.ai_service")

class AIService:

    @staticmethod
    def _clean_markdown(text: str) -> str:
        """Strip double asterisks ** and heading hashes # for plain, clean text output."""
        if not text:
            return ""
        cleaned = text.replace("**", "").replace("### ", "").replace("## ", "").replace("# ", "")
        return cleaned.strip()

    @staticmethod
    async def get_team_members() -> List[str]:
        try:
            users = await User.find_all().to_list()
            members = [u.name for u in users if getattr(u, 'role', 'member') == 'member']
            if not members:
                members = [u.name for u in users if u.role not in ['admin', 'manager']]
            return sorted(list(set(members)))
        except Exception as e:
            logger.warning(f"Error fetching users for AI context: {e}")
            return ["Elena Rostova", "Marcus Vance", "Sarah Chen"]

    @staticmethod
    async def build_report_context(current_user: User, week_start_date: Optional[str] = None) -> str:
        query = {}
        if week_start_date:
            query["week_start_date"] = week_start_date
        
        # STRICT RBAC: Members can only see their own report context
        if current_user.role == "member":
            query["user_id"] = str(current_user.id)
            
        reports = await Report.find(query).sort("-created_at").limit(20).to_list()
        
        if not reports:
            return "No report data currently available."

        context_lines = []
        for r in reports:
            line = f"Report [ID: {r.id}] | Member: {r.user_name} | Week: {r.week_start_date} | Status: {r.status} | Project: {r.project_name or 'N/A'}\n"
            if r.content:
                if r.content.tasks_completed:
                    tasks_list = ", ".join([f"{t.task_name} ({t.status})" for t in r.content.tasks_completed])
                    line += f"  - Tasks: {tasks_list}\n"
                
                if r.content.tasks_planned_next_week:
                    goals_list = ", ".join([f"{g.task_name} (Priority: {g.priority})" for g in r.content.tasks_planned_next_week])
                    line += f"  - Goals: {goals_list}\n"

                if r.content.achievements:
                    achievements_list = ", ".join([f"{a.text} {'[KEY]' if getattr(a, 'is_key_achievement', False) else ''}" for a in r.content.achievements])
                    line += f"  - Achievements: {achievements_list}\n"
                
                if r.content.blockers:
                    blockers_list = ", ".join([f"{b.text} {'[KEY]' if getattr(b, 'is_key_issue', False) else ''}" for b in r.content.blockers])
                    line += f"  - Blockers: {blockers_list}\n"
            context_lines.append(line.strip())

        return "\n\n".join(context_lines)

    @classmethod
    async def chat(cls, prompt: str, current_user: User, week_start_date: Optional[str] = None) -> str:
        prompt_lower = prompt.lower().strip()

        # 0. GREETING INTENT HANDLING
        greetings = ["hi", "hii", "hiii", "hello", "hey", "heyy", "greetings", "good morning", "good afternoon", "good evening"]
        clean_words = re.findall(r'\w+', prompt_lower)
        if prompt_lower in greetings or (len(clean_words) == 1 and clean_words[0] in greetings):
            user_first_name = current_user.name.split()[0] if current_user and current_user.name else "there"
            return f"Hello {user_first_name}! I am your role-aware ProgressHub Assistant. How can I help you today?"

        # 1. PREVENT PROMPT INJECTION & INTERNAL REVELATIONS
        injection_keywords = ["system prompt", "ignore previous instructions", "database credentials", "api keys", "secrets", "pretend i am", "give me all database records"]
        if any(k in prompt_lower for k in injection_keywords):
            return "I can help with authorized ProgressHub information, but I can't expose raw database records, internal system data, or override role instructions."

        # 2. RBAC EXPLICIT OVERRIDES
        if current_user.role == "member":
            forbidden_topics = ["sarah's report", "everyone's blockers", "team performance", "lowest performance in the team", "manager say about another employee"]
            if any(f in prompt_lower for f in forbidden_topics):
                return "I can only provide information from your own reports and data. Team analytics are available to managers."

        # 3. BUILD AUTHORIZED CONTEXT
        report_context = await cls.build_report_context(current_user, week_start_date)

        # 4. CONSTRUCT ROLE-SPECIFIC PROMPT
        if current_user.role == "member":
            system_instructions = (
                "You are ProgressHub Assistant, a personal productivity assistant for a team member.\n\n"
                "STRICT CONSTRAINTS AND RULES:\n"
                "1. DO NOT INVENT DATA. If the answer is not in the provided context, say 'I don't have enough information in the available ProgressHub data to answer that.'\n"
                "2. DATA PRIVACY: You must NEVER provide information about other team members' reports, tasks, goals, or blockers. If asked about another member, say 'I can only provide information from your own reports and data.'\n"
                "3. You can assist with writing and summarizing the user's own reports.\n"
                "4. Keep responses concise, direct, and focused.\n"
                "5. Output clean plain text. Never use double asterisks ** or heading hashes (#).\n"
            )
        else:
            system_instructions = (
                "You are ProgressHub Assistant, a team analytics and decision-support assistant for a manager.\n\n"
                "STRICT CONSTRAINTS AND RULES:\n"
                "1. DO NOT INVENT DATA. If the answer is not in the provided context, say 'I don't have enough information in the available ProgressHub data to answer that.'\n"
                "2. FACT vs RECOMMENDATION: Distinguish clearly between data facts and your AI recommendations. Never present an AI assumption as a fact.\n"
                "3. You can answer questions about team reporting status, pending reviews, blockers across the team, and workload distributions.\n"
                "4. Keep responses concise. Use bullet points for summaries.\n"
                "5. Output clean plain text. Never use double asterisks ** or heading hashes (#).\n"
            )

        full_prompt = (
            f"Authorized User Context: Name={current_user.name}, Role={current_user.role}\n\n"
            f"Available ProgressHub Data Context:\n{report_context}\n\n"
            f"User Question: {prompt}\n"
            f"Answer:"
        )

        # 5. CALL AI PROVIDERS
        if settings.GROK_API_KEY:
            try:
                is_groq = settings.GROK_API_KEY.startswith("gsk_")
                api_url = "https://api.groq.com/openai/v1/chat/completions" if is_groq else "https://api.x.ai/v1/chat/completions"
                model_name = "llama-3.1-8b-instant" if is_groq else (settings.GROK_MODEL or "grok-beta")
                
                async with httpx.AsyncClient(timeout=15.0) as client:
                    resp = await client.post(
                        api_url,
                        headers={
                            "Authorization": f"Bearer {settings.GROK_API_KEY}",
                            "Content-Type": "application/json"
                        },
                        json={
                            "model": model_name,
                            "messages": [
                                {"role": "system", "content": system_instructions},
                                {"role": "user", "content": full_prompt}
                            ],
                            "temperature": 0.1,
                            "max_tokens": 800
                        }
                    )
                    if resp.status_code == 200:
                        data = resp.json()
                        res_text = data["choices"][0]["message"]["content"]
                        return cls._clean_markdown(res_text)
                    else:
                        logger.warning(f"Cloud AI API error ({resp.status_code}): {resp.text}")
            except Exception as e:
                logger.warning(f"Cloud AI API Exception: {e}")

        base_url = settings.OLLAMA_BASE_URL.rstrip('/')
        ollama_gen_url = f"{base_url}/api/generate"
        
        try:
            async with httpx.AsyncClient(timeout=45.0) as client:
                target_model = settings.OLLAMA_MODEL or "llama3.1:latest"
                resp = await client.post(
                    ollama_gen_url,
                    json={
                        "model": target_model,
                        "system": system_instructions,
                        "prompt": full_prompt,
                        "stream": False,
                        "options": {
                            "temperature": 0.1,
                            "top_p": 0.8,
                            "num_predict": 800
                        }
                    }
                )
                if resp.status_code == 200:
                    data = resp.json()
                    res_text = data.get("response", "").strip()
                    if res_text:
                        return cls._clean_markdown(res_text)
        except Exception as e:
            logger.info(f"Ollama local instance not reachable: {e}")

        # 6. FALLBACK LOGIC
        fallback_res = cls._generate_fallback_summary(prompt, current_user.role, report_context)
        return cls._clean_markdown(fallback_res)

    @staticmethod
    def _generate_fallback_summary(prompt: str, role: str, context: str) -> str:
        prompt_lower = prompt.lower()
        if role == "member":
            if "status" in prompt_lower:
                return "Fallback: You have access to your own reports. (AI service unavailable to summarize)"
            elif "other" in prompt_lower or "team" in prompt_lower or "everyone" in prompt_lower:
                return "I can only provide information from your own reports and data."
            return "Fallback: ProgressHub AI is currently offline. Please check your dashboard manually."
        else:
            if "status" in prompt_lower or "pending" in prompt_lower:
                return "Fallback: Multiple reports pending review in the team queue. (AI service unavailable to summarize)"
            return "Fallback: ProgressHub Team AI is currently offline. Please check the manager dashboard manually."




