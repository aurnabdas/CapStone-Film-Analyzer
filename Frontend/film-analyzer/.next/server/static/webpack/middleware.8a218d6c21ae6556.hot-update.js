"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("middleware",{

/***/ "(middleware)/./middleware.ts":
/*!***********************!*\
  !*** ./middleware.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   config: () => (/* binding */ config),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _clerk_nextjs_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @clerk/nextjs/server */ \"(middleware)/./node_modules/@clerk/nextjs/dist/esm/server/routeMatcher.js\");\n/* harmony import */ var _clerk_nextjs_server__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @clerk/nextjs/server */ \"(middleware)/./node_modules/@clerk/nextjs/dist/esm/server/clerkMiddleware.js\");\n\n// Define routes that need protection, excluding /signup and /login paths\nconst isProtectedRoute = (0,_clerk_nextjs_server__WEBPACK_IMPORTED_MODULE_0__.createRouteMatcher)(\"/((?!signup|login).*)\");\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_clerk_nextjs_server__WEBPACK_IMPORTED_MODULE_1__.clerkMiddleware)());\nconst config = {\n    matcher: [\n        // Skip Next.js internals and all static files\n        \"/((?!_next|[^?]*\\\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)\",\n        // Always run for API routes\n        \"/(api|trpc)(.*)\",\n        // Add protected routes\n        \"/protected(.*)\"\n    ]\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKG1pZGRsZXdhcmUpLy4vbWlkZGxld2FyZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQTJFO0FBRTNFLHlFQUF5RTtBQUN6RSxNQUFNRSxtQkFBbUJELHdFQUFrQkEsQ0FBQztBQUU1QyxpRUFBZUQscUVBQWVBLEVBQUVBLEVBQUM7QUFFMUIsTUFBTUcsU0FBUztJQUNwQkMsU0FBUztRQUNQLDhDQUE4QztRQUM5QztRQUNBLDRCQUE0QjtRQUM1QjtRQUNBLHVCQUF1QjtRQUN2QjtLQUNEO0FBQ0gsRUFBRSIsInNvdXJjZXMiOlsid2VicGFjazovL19OX0UvLi9taWRkbGV3YXJlLnRzPzQyMmQiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY2xlcmtNaWRkbGV3YXJlLCBjcmVhdGVSb3V0ZU1hdGNoZXIgfSBmcm9tIFwiQGNsZXJrL25leHRqcy9zZXJ2ZXJcIjtcblxuLy8gRGVmaW5lIHJvdXRlcyB0aGF0IG5lZWQgcHJvdGVjdGlvbiwgZXhjbHVkaW5nIC9zaWdudXAgYW5kIC9sb2dpbiBwYXRoc1xuY29uc3QgaXNQcm90ZWN0ZWRSb3V0ZSA9IGNyZWF0ZVJvdXRlTWF0Y2hlcignLygoPyFzaWdudXB8bG9naW4pLiopJyk7XG5cbmV4cG9ydCBkZWZhdWx0IGNsZXJrTWlkZGxld2FyZSgpO1xuXG5leHBvcnQgY29uc3QgY29uZmlnID0ge1xuICBtYXRjaGVyOiBbXG4gICAgLy8gU2tpcCBOZXh0LmpzIGludGVybmFscyBhbmQgYWxsIHN0YXRpYyBmaWxlc1xuICAgICcvKCg/IV9uZXh0fFteP10qXFxcXC4oPzpodG1sP3xjc3N8anMoPyFvbil8anBlP2d8d2VicHxwbmd8Z2lmfHN2Z3x0dGZ8d29mZjI/fGljb3xjc3Z8ZG9jeD98eGxzeD98emlwfHdlYm1hbmlmZXN0KSkuKiknLFxuICAgIC8vIEFsd2F5cyBydW4gZm9yIEFQSSByb3V0ZXNcbiAgICAnLyhhcGl8dHJwYykoLiopJyxcbiAgICAvLyBBZGQgcHJvdGVjdGVkIHJvdXRlc1xuICAgICcvcHJvdGVjdGVkKC4qKScsXG4gIF0sXG59OyJdLCJuYW1lcyI6WyJjbGVya01pZGRsZXdhcmUiLCJjcmVhdGVSb3V0ZU1hdGNoZXIiLCJpc1Byb3RlY3RlZFJvdXRlIiwiY29uZmlnIiwibWF0Y2hlciJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(middleware)/./middleware.ts\n");

/***/ })

});