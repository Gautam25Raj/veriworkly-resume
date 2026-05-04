# 🧩 Claude-Specific Context

When working on VeriWorkly with Claude:

1. **Component Modularization**: Claude is excellent at refactoring. Use it to split large components in `apps/resume-builder/features` into smaller, atomic pieces.
2. **Tailwind 4 Syntax**: Remind Claude that we use Tailwind CSS 4, which uses the `@theme` block in CSS instead of a `tailwind.config.js`.
3. **Prisma Schema**: Provide the `prisma/schema.prisma` file when asking for database changes; Claude excels at relational modeling.
4. **Backend Logic**: For complex backend logic in `apps/server/src`, break down the request into smaller steps and ask Claude to generate code for each step.
