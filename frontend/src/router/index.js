import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Collage from "../views/Collage.vue";
import Megamix from "../views/Megamix.vue";
import Search from "../views/Search.vue";
import Authorise from "../components/Home/Authorise.vue";
import Features from "../components/Home/Features.vue";
import AuthReader from "../components/Home/AuthReader.vue";

Vue.use(VueRouter);

const routes = [
	{
		path: "/",
		component: Home,
		children: [
			{
				path: "authorise",
				name: "Authorise",
				component: Authorise,
			},
			{
				path: "",
				name: "",
				component: Features,
			},
		],
	},
	{
		path: "/auth/collect/:query",
		component: AuthReader,
	},
	{
		path: "/collage",
		component: Collage,
	},
	{
		path: "/megamix",
		component: Megamix,
	},
	{
		path: "/search",
		component: Search
	}
];

const router = new VueRouter({
	routes,
});

export default router;
