/**
 * @see url https://gist.github.com/azjezz/e7e49dd317fea6f7a2a9f4ab54af2124
 */
class Storage_class {

    static get(key) {
        let value = localStorage.getItem(key);
        return value === null ? null : JSON.parse(value);
    }

    static set(key,value) {
        return localStorage.setItem(key,JSON.stringify(value));
    }

    static unset(key) {
        if(this.isset(key))
            return localStorage.removeItem(key);
        else
            return null;
    }

    static clear() {
        return localStorage.clear();
    }

    static isset(key) {
        return this.get(key) !== null;
    }

}

