function Storage(prefix) {
    const listeners = new Map;
    const binds = new Map;

    this.bindReact = (component, prop, name) => {
        if(!component || !prop || !name)
            return;

        if(!binds.has(name)){
            binds.set(name, new Set);
        }

        const info = {
            component: component,
            prop: prop,
            callback: (function(value) {
                const _ = {};
                _[prop] = value;
                this.setState(_);
            }).bind(component)
        };
        binds.get(name).add(info);

        info.callback(this.get(name));
    };

    this.unbindReact = (component, prop, name) => {
        if(!component || !prop || !name)
            return;

        if(!binds.has(name))
            return;

        binds.get(name).forEach(_ => {
            if(_.component === component && _.prop === prop){
                binds.get(name).delete(_);
            }
        });
    };

    this.attach = (self, props) => {
        if(!self.__storage_binds_list){
            self.__storage_binds_list = new Set;
        }

        Object.keys(props).forEach((prop) => {
            this.bindReact(self, prop, props[prop]);
            self.__storage_binds_list.add({component: self, prop, name: props[prop]});
            const _ = {};
            _[prop] = this.get(props[prop]);
            self.setState(_);
        });
    };

    this.deattach = (self) => {
        if(self.__storage_binds_list){
            self.__storage_binds_list.forEach(_ => {
                this.unbindReact(_.component, _.prop, _.name);
            });
        }
    };

    this.on = (name, callback) => {
        if(!name || !callback)
            return;

        if(!listeners.has(name)){
            listeners.set(name, new Set);
        }

        listeners.get(name).add(callback);

        const _ = this.get(name);
        callback(_, _);
    };

    window.addEventListener('storage', function(e) {
        if(e.key.indexOf(`${prefix}:`) === 0){
            const name = e.key.slice(prefix.length + 1);
            let value = e.newValue;
            let oldValue = e.oldValue;

            try{
                value = JSON.parse(value);
            }
            catch(e){

            }
            try{
                oldValue = JSON.parse(oldValue);
            }
            catch(e){

            }

            if(listeners.has(name)){
                listeners.get(name).forEach(listener => {
                    listener(value, oldValue);
                });
            }

            if(binds.has(name)){
                binds.get(name).forEach(bind => bind.callback(value));
            }
        }
    });

    this.remove = (name, callback) => {
        if(!name || !callback)
            return;

        if(!listeners.has(name))
            return;

        listeners.get(name).delete(callback);
    };

    this.set = (name, value) => {
        if(listeners.has(name)){
            listeners.get(name).forEach(listener => {
                listener(value, this.get(name)); // value, previous_value
            });
        }

        if(binds.has(name)){
            binds.get(name).forEach(bind => bind.callback(value));
        }

        return localStorage.setItem(`${prefix}:${name}`, typeof value === 'object' ? JSON.stringify(value) : value);
    };

    this.get = (name) => {
        const _ = localStorage.getItem(`${prefix}:${name}`);
        try{
            return JSON.parse(_);
        }
        catch(e){
            return _;
        }
    };

    this.del = (name) => {
        if(listeners.has(name)){
            listeners.get(name).forEach(listener => {
                listener(null, this.get(name)); // value, previous_value
            });
        }

        if(binds.has(name)){
            binds.get(name).forEach(bind => bind.callback(null));
        }

        return localStorage.removeItem(`${prefix}:${name}`);
    };
}

export default new Storage('lc');