class HashMap{
	contructor(initialCapacity=8) {
		this.length = 0;
		this._slots = [];
		this._capacity = initialCapacity;
		this._deleted = 0;
	}

	get(key) {
		const index = this._findSlot(key);

		if (this._slots[index] === undefined) {
			throw new Error('Key error');
		}
		return this._slots[index].value;
	}

	// checks whether load ratio is greater than the given maximum
	set(key, value) {
		const loadRatio = (this.length + 1) / this._capacity;

		if (loadRatio > HashMap.MAX_LOAD_RATIO) {
			this._resize(this._capacity * HashMap.SIZE_RATIO)
		}

		const index = this._findSlot(key);
		this._slots[index] = {
			key,
			value
		};
		this.length++;
	}

	//finds the correct slot for the key, and sets the deleted flag to true
	//decreasing the length and increasing the deleted count
	remove(key) {
    	const index = this._findSlot(key);
    	const slot = this._slots[index];
    	if (slot === undefined) {
        	throw new Error('Key error');
        }
    	slot.deleted = true;
        this.length--;
        this._deleted++;
    }

	//takes a stirng and hases it, outputting a number
	//http://www.cse.yorku.ca/~oz/hash.html
	static _hashString(string) {
		let hash = 5381;
		for (let i=0; i<string.length; i++) {
			hash = (hash << 5) + hash + string.charCodeAt(i);
			hash = hash & hash;
		}
		return  hash >>> 0;
	}

	//finds the correct slot for a given key
	_findSlot(key) {
		const hash = HashMap._hashString(key);
		const start = hash % this._capacity;

		for (let i=start; i<start + this._capacity; i++) {
			const index = i % this._capacity;
			const slot = this._slots[index];

			if (slot === undefined || (slot.key == key && !slot.deleted)) {
				return index;
			}
		}
	}

	_resize(size) {
		const oldSlots = this._slots;
		this._capacity = size;
		// Reset the length - it will get rebuilt as you add the items back
        this.length = 0;
        this._deleted = 0;
        this._slots = [];

        for (const slot of oldSlots) {
        	if (slot !=== undefined && !slot.deleted) {
        		this.set(slot.key, slot.value);
        	}
        }
	}
}

HashMap.MAX_LOAD_RATIO = 0.9;
HashMap.SIZE_RATIO = 3;
