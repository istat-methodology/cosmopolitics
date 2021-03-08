import Vue from "vue";

/* Material design icons available at:
 *
 * https://materialdesignicons.com/
 *
 * Documentation on the component is available at:
 *
 * https://www.npmjs.com/package/vue-material-design-icons
 */
import "vue-material-design-icons/styles.css";

import HomeIcon from "icons/Home.vue";
import LayersIcon from "icons/Layers.vue";
import ChevronRightBoxIcon from "icons/ArrowRightBold.vue";
import AddIcon from "icons/PlusBox.vue";
import EditIcon from "icons/SquareEditOutline.vue";
import DeleteIcon from "icons/TrashCanOutline.vue";
import ViewIcon from "icons/Magnify.vue";
import TextIcon from "icons/TextBoxOutline.vue";
import UserIcon from "icons/AccountOutline.vue";
import UsersIcon from "icons/AccountMultipleOutline.vue";
import ServerIcon from "icons/Server.vue";
import SettingsIcon from "icons/CogOutline.vue";
import LogoutIcon from "icons/Logout.vue";
import RegulationIcon from "icons/Bank.vue";
import GsimIcon from "icons/Puzzle.vue";
import GsimOutlineIcon from "icons/PuzzleOutline.vue";

Vue.component("chevron-right-icon", ChevronRightBoxIcon);
Vue.component("home-icon", HomeIcon);
Vue.component("layers-icon", LayersIcon);
Vue.component("add-icon", AddIcon);
Vue.component("edit-icon", EditIcon);
Vue.component("delete-icon", DeleteIcon);
Vue.component("view-icon", ViewIcon);
Vue.component("text-icon", TextIcon);
Vue.component("user-icon", UserIcon);
Vue.component("users-icon", UsersIcon);
Vue.component("logout-icon", LogoutIcon);
Vue.component("server-icon", ServerIcon);
Vue.component("settings-icon", SettingsIcon);
Vue.component("regulation-icon", RegulationIcon);
Vue.component("gsim-icon", GsimIcon);
Vue.component("gsim-outline-icon", GsimOutlineIcon);
