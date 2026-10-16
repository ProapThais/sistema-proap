<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Pages read data only through `src/data/repository.ts`; demo data lives in `src/data/demo.ts`. Why: swap to a real database later without touching pages.
- Shared UI primitives live in `src/components/ui-kit.tsx`, app layout in `src/components/AppShell.tsx` (rendered from `__root`). Why: consistent design tokens.
- No auth or persistence yet; forms only simulate saving. Why: current phase is navigable interface only.
