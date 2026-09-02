import logging
from typing import Optional, Dict, Any, List
import httpx
from app.models.report import Report
from app.config import settings

logger = logging.getLogger("app.ai_service")

class AIService:

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
        report_context = await cls.build_report_context(week_start_date)
        
        system_instructions = (
            "You are an AI Team Assistant for a engineering team manager. "
            "Use the provided team weekly report summary context to answer questions concisely and accurately. "
            "Focus on achievements, blockers, task progress, and workload balance."
        )
        
        full_prompt = f"Team Context:\n{report_context}\n\nManager Question: {prompt}"

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
        ollama_url = f"{settings.OLLAMA_BASE_URL.rstrip('/')}/api/generate"
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.post(
                    ollama_url,
                    json={
                        "model": settings.OLLAMA_MODEL or "llama3",
                        "system": system_instructions,
                        "prompt": full_prompt,
                        "stream": False
                    }
                )
                if resp.status_code == 200:
                    data = resp.json()
                    return data.get("response", "No response content from Ollama.")
        except Exception as e:
            logger.info(f"Ollama local instance not reachable at {ollama_url} ({e}). Using intelligent summary fallback.")

        # 3. Fallback: Intelligent summary generation using local report context
        return cls._generate_fallback_summary(prompt, report_context)

    @staticmethod
    def _generate_fallback_summary(prompt: str, context: str) -> str:
        prompt_lower = prompt.lower()
        if "blocker" in prompt_lower or "issue" in prompt_lower:
            return f"**Blocker Analysis Summary** based on current team reports:\n\n{context}\n\n*Recommendation*: Focus review on team members with key issues flagged above."
        elif "achievement" in prompt_lower or "completed" in prompt_lower or "progress" in prompt_lower:
            return f"**Team Progress & Achievements Summary**:\n\n{context}\n\n*Highlights*: Review key achievements and completed tasks listed for each member."
        else:
            return f"**Weekly Team Summary Assistant Response**:\n\nBased on your recent reports context:\n{context}\n\n(Tip: Connect local Ollama at `{settings.OLLAMA_BASE_URL}` or set `GROK_API_KEY` in `backend/.env` for real-time generative Q&A)."
