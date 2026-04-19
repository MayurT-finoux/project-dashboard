# project-dashboard

## Before working on code

Always sync the `project_plans` submodule before AI or any collaborator starts working on the code.

```bash
git submodule update --remote docs/plans
git add docs/plans
git commit -m "chore: sync plans submodule"
```

If the submodule has not been added yet, run:

```bash
git submodule add https://github.com/MayurT-finoux/project_plans docs/plans
```
