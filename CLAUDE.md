# CLAUDE.md

## Git

All git commands that use SSH (push, pull, fetch, clone) must use the custom SSH key:

```bash
GIT_SSH_COMMAND="ssh -i ~/.ssh/id_rsa_xerxesb" git push ...
```

Prepend `GIT_SSH_COMMAND="ssh -i ~/.ssh/id_rsa_xerxesb"` to every git command that contacts a remote.
