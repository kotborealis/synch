import {useEffect, useState} from 'react';
import storage from './Storage';

export const useStorage = (name, initial) => {
    const initial_value = storage.get(name) || initial;
    const [value, setValue] = useState(initial_value);

    useEffect(() => {
        if(storage.get(name) === null)
            storage.set(name, initial);
    }, []);

    useEffect(() => {
        storage.on(name, setValue);
        return () => storage.remove(name, setValue);
    }, [name]);

    return [
        value,
        (value) => storage.set(name, value)
    ];
};