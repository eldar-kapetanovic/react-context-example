import { browserHistory } from "./browserHistory";

export default class RouterHelper {
    static fixViewName(view) {
        return (view.startsWith("/") ? view : `/${view}`);
    }

    static navigateTo(view) {
        browserHistory.push(this.fixViewName(view));
    }

    static back() {
        browserHistory.goBack();
    }

    static current() {
        return browserHistory.location.pathname.substring(1);
    }

    static listen(callback) {
        return browserHistory.listen(callback);
    }
}
