export default {
  data() {
    return {
      breadcrumbMap: [
        {
          route: "Map",
          breadCrumbs: [
            { path: "view", to: "/view" },
            { path: "Trade indicators", to: "" }
          ]
        },
        {
          route: "Graph",
          breadCrumbs: [
            { path: "view", to: "/view" },
            { path: "Graph", to: "" }
          ]
        },
        {
          route: "Policy",
          breadCrumbs: [
            { path: "view", to: "/view" },
            { path: "Policy", to: "" }
          ]
        },
        {
          route: "Trade",
          breadCrumbs: [
            { path: "view", to: "/view" },
            { path: "Trade", to: "" }
          ]
        }
      ]
    }
  },
  methods: {
    getBreadcrumbs(route) {
      let crumb = this.breadcrumbMap.find((crumb) => {
        return crumb.route == route.name
      })
      return crumb == undefined
        ? this.createBreadcrumbs(route)
        : crumb.breadCrumbs
    },
    createBreadcrumbs(route) {
      let pathArray = route.path.split("/")
      pathArray.shift()
      //console.log(route.params);
      if (Object.keys(route.params).length > 0) {
        //if route has a parameter remove it from array
        pathArray.pop()
      }
      let breadcrumbs = pathArray.reduce((breadcrumbArray, path, idx) => {
        var to = "/"
        if (idx > 0) {
          for (var i = 0; i < idx; i++) {
            to += breadcrumbArray[i].path + "/"
          }
        }
        to += path
        //console.log(to);
        breadcrumbArray.push({
          path: path,
          to: to
        })
        return breadcrumbArray
      }, [])
      return breadcrumbs
    }
  }
}
