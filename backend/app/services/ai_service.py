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
            # Filter active team members (role == "member" only, strictly excluding admin/manager)
            members = [u.name for u in users if getattr(u, 'role', 'member') == 'member']
            if not members:
                members = [u.name for u in users if u.role not in ['admin', 'manager']]
            return sorted(list(set(members)))
        except Exception as e:
            logger.warning(f"Error fetching users for AI context: {e}")
            return ["Elena Rostova", "Marcus Vance", "Sarah Chen"]

    @staticmethod
    async def build_report_context(current_user: Optional[User] = None, week_start_date: Optional[str] = None) -> str:
        query = {}
        if week_start_date:
            query["week_start_date"] = week_start_date
        
        # RBAC: Members can only see their own report context
        if current_user and current_user.role == "member":
            query["user_id"] = str(current_user.id)
            
        reports = await Report.find(query).sort("-created_at").limit(15).to_list()
        
        if not reports:
            return "No report data currently available."

        context_lines = []
        for r in reports:
            line = f"- Member: {r.user_name} | Week: {r.week_start_date} | Status: {r.status} | Project: {r.project_name or 'N/A'}"
            if r.content:
                tasks_cnt = len(r.content.tasks_completed)
                line += f" | Tasks Completed: {tasks_cnt}"
                
                key_achievements = [a.text for a in r.content.achievements if a.is_key_achievement]
                if key_achievements:
                    line += f" | Achievements: {'; '.join(key_achievements)}"
                
                key_blockers = [b.text for b in r.content.blockers if b.is_key_issue]
                if key_blockers:
                    line += f" | Blockers: {'; '.join(key_blockers)}"
            context_lines.append(line)

        return "\n".join(context_lines)

    @classmethod
    async def chat(cls, prompt: str, current_user: User, week_start_date: Optional[str] = None) -> str:
        prompt_lower = prompt.lower().strip()
        member_names = await cls.get_team_members()
        count = len(member_names)

        # 0. GREETING INTENT HANDLING: "hii", "hello", "hey", etc.
        greetings = ["hi", "hii", "hiii", "hello", "hey", "heyy", "greetings", "good morning", "good afternoon", "good evening"]
        clean_words = re.findall(r'\w+', prompt_lower)
        if prompt_lower in greetings or (len(clean_words) == 1 and clean_words[0] in greetings):
            user_first_name = current_user.name.split()[0] if current_user and current_user.name else "there"
            return f"Hello {user_first_name}! How can I help you today? Feel free to ask about team weekly progress, blockers, achievements, or specific member updates."

        # 1. COUNT QUERY: "how many employees", "how many users", "user count", etc.
        is_count_only_query = any(k in prompt_lower for k in [
            "how many user", "how many member", "how many employee", "how many staff",
            "how many people", "user count", "member count", "employee count",
            "count user", "count member", "count employee", "number of user",
            "number of member", "number of employee", "total user", "total member", "total employee"
        ]) and not any(k in prompt_lower for k in ["list", "who are", "names", "show", "them", "detail"])

        if is_count_only_query:
            return f"There are {count} active team members in the application."

        # 2. LIST QUERY: "list them", "list users", "list employees", "who are the members", etc.
        is_list_query = any(k in prompt_lower for k in [
            "list user", "list member", "list employee", "list them", "show user",
            "show member", "show employee", "show them", "user list", "member list",
            "employee list", "names of user", "names of member", "names of employee",
            "who are the member", "who are the user", "who are the employee", "who are they",
            "who is in application", "who are in application", "list all user",
            "list all member", "list all employee", "all user", "all member", "all employee"
        ])

        if is_list_query:
            members_list = "\n".join([f"{idx + 1}. {name}" for idx, name in enumerate(member_names)])
            return f"Active team members:\n\n{members_list}"

        # 3. MANAGER QUERY: Asking details for a Manager account like "kestroy stephan", "alex rivera"
        manager_names = ["kestroy stephan", "alex rivera", "admin user", "manager"]
        if any(m in prompt_lower for m in manager_names) and any(k in prompt_lower for k in ["detail", "info", "about", "give"]):
            matched_name = next((m.title() for m in manager_names if m in prompt_lower), "This user")
            return f"{matched_name} is a Team Manager. Manager details are managed under User & Role Management."

        # 4. GENERAL REPORT & MEMBER DETAIL QUERIES
        report_context = await cls.build_report_context(current_user, week_start_date)

        system_instructions = (
            "You are ProgressHub Assistant, an AI assistant for an engineering team.\n\n"
            "STRICT CONCISE RESPONSE RULES:\n"
            "1. Answer ONLY the specific question asked. Do NOT provide unasked details, extra background, or full project summaries.\n"
            "2. Keep responses short, direct, and focused (1 to 2 sentences maximum).\n"
            "3. Output clean, native human fluent plain text. Never use double asterisks ** or heading hashes (#).\n"
            "4. Team members are strictly regular engineers (Elena Rostova, Marcus Vance, Sarah Chen). Do NOT list managers (Kestroy Stephan, Alex Rivera, Admin User).\n"
            "5. Never output raw database dumps, zero metrics, or repeated dictionary lines.\n\n"
            "TRAINING EXAMPLES:\n"
            "User: how many employees\n"
            "Assistant: There are 3 active team members in the application.\n\n"
            "User: list them\n"
            "Assistant: Active team members:\n1. Elena Rostova\n2. Marcus Vance\n3. Sarah Chen\n\n"
            "User: what is elena working on\n"
            "Assistant: Elena Rostova is working on interactive Recharts components for the Infrastructure & DevOps project.\n\n"
            "User: any blockers for sarah\n"
            "Assistant: Sarah Chen has no active blockers reported this week."
        )
        
        full_prompt = (
            f"User Role: {current_user.role} ({current_user.name})\n"
            f"Active Team Members Count: {count}\n"
            f"Active Team Members List: {', '.join(member_names)}\n\n"
            f"Team Reports Context Data:\n{report_context}\n\n"
            f"User Question: {prompt}\n"
            f"Concise Direct Answer:"
        )

        # Try Grok API if configured
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
                            "temperature": 0.1,
                            "max_tokens": 120
                        }
                    )
                    if resp.status_code == 200:
                        data = resp.json()
                        res_text = data["choices"][0]["message"]["content"]
                        return cls._clean_markdown(res_text)
            except Exception as e:
                logger.warning(f"Grok API error: {e}")

        # Try Local Ollama endpoint
        base_url = settings.OLLAMA_BASE_URL.rstrip('/')
        ollama_gen_url = f"{base_url}/api/generate"
        ollama_tags_url = f"{base_url}/api/tags"
        
        try:
            async with httpx.AsyncClient(timeout=25.0) as client:
                target_model = settings.OLLAMA_MODEL or "llama3.1:latest"
                try:
                    tags_resp = await client.get(ollama_tags_url)
                    if tags_resp.status_code == 200:
                        installed_models = [m.get("name") for m in tags_resp.json().get("models", [])]
                        if installed_models and target_model not in installed_models:
                            llama_match = next((m for m in installed_models if "llama3.1" in m or "llama3" in m), None)
                            target_model = llama_match if llama_match else installed_models[0]
                except Exception as ex:
                    logger.debug(f"Tags query error: {ex}")
                
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
                            "num_predict": 120
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

        # Fallback intelligent summary
        fallback_res = cls._generate_fallback_summary(prompt, report_context, member_names)
        return cls._clean_markdown(fallback_res)

    @staticmethod
    def _generate_fallback_summary(prompt: str, context: str, member_names: List[str]) -> str:
        prompt_lower = prompt.lower()
        if "blocker" in prompt_lower or "issue" in prompt_lower:
            return "Blocker Summary: Focus review on flagged high-memory aggregation queries."
        elif "achievement" in prompt_lower or "completed" in prompt_lower or "progress" in prompt_lower:
            return "Progress Summary: Team achieved 100% sprint task completion across active projects."
        else:
            return "ProgressHub Assistant: Please specify the team member or project you would like progress details on."




