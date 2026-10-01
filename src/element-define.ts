/**
 * `<hitotsu-table>`, registered by being imported:
 *
 *   <script type="module" src="…/dist/element-define.js"></script>
 *   <hitotsu-table rules="party" computers="3"></hitotsu-table>
 *
 * The one module of the package that does something when it is imported, and
 * `package.json` says so, so that a bundler keeps it. `./element` exports the
 * same class and `defineHitotsuTable()` with no effect of its own, for a page
 * that wants to choose when.
 */
import { defineHitotsuTable } from "./element.ts";

export * from "./element.ts";

defineHitotsuTable();
