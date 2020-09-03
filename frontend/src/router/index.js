import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Authorise from "../components/Authorise.vue";
import Features from "../components/Features.vue";
import AuthReader from "../components/AuthReader.vue";

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
];

const router = new VueRouter({
	routes,
});

export default router;
