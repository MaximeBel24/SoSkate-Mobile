const noop = () => {};

export const logger = {
  /** Dev-only — supprimé en prod. Pour le debug temporaire. */
  dev: __DEV__ ? console.log.bind(console) : noop,

  /** Erreurs — toujours actif. Pour les catch blocks légitimes. */
  error: console.error.bind(console),

  /** Warnings — toujours actif. Pour les cas dégradés non bloquants. */
  warn: console.warn.bind(console),
};
