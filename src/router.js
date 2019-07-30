import Vue from "vue";
import Router from "vue-router";
import Table from "./components/table";

Vue.use(Router);

export default new Router({
    mode: "history",
    base: process.env.BASE_URL,
    routes: [
        {
            path: "/",
            name: "table",
            component: Table
        },
        {
            path: "/details/:id",
            name: "details",
            component: () =>
                import("./components/details"),
            props: true,
            beforeEnter(to, from, next){
                if(to.params.details == undefined){
                    next({path: '/'});
                }
                return next();
            }
        }
    ]
});
