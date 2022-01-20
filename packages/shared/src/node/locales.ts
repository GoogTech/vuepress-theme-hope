import { checkLang, deepAssign, lang2Path, showLangError } from "../shared";
import type { App, AppOptions, LocaleConfig } from "@vuepress/core";
import type { BaseThemeConfig, HopeLang, ConvertLocaleConfig } from "../shared";

/**
 * Get language of root directory
 *
 * @param app VuePress Node App
 * @returns root language
 */
export const getRootLang = (app: App): HopeLang => {
  // infer from siteLocale
  const siteLocales = app.siteData.locales;

  if (siteLocales?.["/"] && checkLang(siteLocales["/"]?.lang))
    return siteLocales["/"].lang as HopeLang;

  // infer from themeLocale
  const options = app.options as AppOptions<BaseThemeConfig>;
  const themeLocales = options.themeConfig.locales;

  if (themeLocales?.["/"] && checkLang(themeLocales["/"]?.lang))
    return themeLocales["/"].lang as HopeLang;

  showLangError("root");

  return "en-US";
};

/**
 * Get the infer language path from root directory language
 *
 * @param app VuePress Node App
 * @returns infer language
 */
export const getRootLangPath = (app: App): string =>
  lang2Path(getRootLang(app));

export const getLocalePaths = (app: App): string[] =>
  Array.from(
    new Set([
      ...Object.keys(app.siteData.locales),
      ...Object.keys(
        (app.options as AppOptions<BaseThemeConfig>).themeConfig.locales || {}
      ),
    ])
  );

/**
 * Get final locale config to passed to client
 *
 * @param app  VuePress Node App
 * @param defaultLocalesConfig default locale config
 * @param userLocalesConfig user locale config
 * @returns final locale config
 */
export const getLocales = <T>(
  app: App,
  defaultLocalesConfig: ConvertLocaleConfig<T>,
  userLocalesConfig: LocaleConfig<T> = {}
): ConvertLocaleConfig<T> => {
  const rootPath = getRootLangPath(app);

  return Object.fromEntries([
    ...getLocalePaths(app).map<[string, T]>((localePath) => [
      localePath,
      deepAssign(
        {},
        userLocalesConfig[localePath] || {},
        defaultLocalesConfig[localePath]
      ),
    ]),
    [
      "/",
      deepAssign(
        {},
        userLocalesConfig["/"] || userLocalesConfig[rootPath] || {},
        defaultLocalesConfig[rootPath]
      ),
    ],
  ]);
};
