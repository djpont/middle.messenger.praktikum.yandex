export {}
/// -------

// type Indexed<T = any> = { [key in string]: T; };
//
// function merge(object1: Indexed, object2: Indexed): Indexed {
// 	const result = object1;
// 	for (const key in object2) {
// 		if (object1[key] === undefined) {
// 			object1[key] = {};
// 		}
// 		if (typeof object2[key] === "object") {
// 			result[key] = merge(object1[key], object2[key]);
// 		} else {
// 			result[key] = object2[key];
// 		}
// 	}
// 	return result;
// }
//
//


// function set(object: Indexed | unknown, path: string, value: unknown): Indexed | unknown {
// 	if (typeof path !== 'string') {
// 		throw new Error('path must be string');
// 	}
// 	if (!(object instanceof Object)) {
// 		return object;
// 	}
//
// 	const object2: Indexed = {};
// 	const pathArray = path.split('.');
// 	pathArray.reduce((obj, key, index) => {
// 		if (index === pathArray.length - 1) {
// 			obj[key] = value;
// 		} else {
// 			obj[key] = {};
// 		}
// 		return obj[key];
// 	}, object2);
//
// 	// console.log(object);
// 	// console.log(object2);
//
// 	object = merge(object, object2);
//
// 	return object;
// }
//


// function isEqual(a: object, b: object): boolean {
// 	console.log(a,b);
// 	if(Object.keys(a).length===Object.keys(b).length){
// 		for(let key in a){
// 			key = key as keyof object;
// 			if(typeof a[key] === typeof b[key]){
// 				if(typeof a[key] === 'object' && a[key]!==null){
// 					if(!isEqual(a[key], b[key])){
// 						return false;
// 					}
// 				}else{
// 					if(!(a[key as any]===b[key as any])){
// 						return false;
// 					}
// 				}
// 			}else{
// 				return false;
// 			}
// 		}
// 	}else{
// 		return false;
// 	}
// 	return true;
// }
//
// const a = {bar: null};
// const b = {bar: {}};
//
// console.log(isEqual(a,b));


// function cloneDeep<T extends object = object>(obj: T) {
// 	let copy: any;
// 	if (typeof obj === 'object' && obj!==null) {
// 		copy = Array.isArray(obj) ? [] : {};
// 		for (const key in obj) {
// 			copy[key] = cloneDeep(obj as unknown[key] as T);
// 		}
// 	}else{
// 		copy = obj;
// 	}
// 	return copy;
// }
//
//
// const a = {foo: 2, bar: 4, baz: {a:1, b:3, c:[1,2,3]}};
// const b = cloneDeep(a);
// console.log(a);
// console.log(b);


//
// type StringIndexed = Record<string, any>;
//
// const obj: StringIndexed = {
// 	key: 1,
// 	key2: 'test',
// 	key3: false,
// 	key4: true,
// 	key5: [1, 2, 3],
// 	key6: {a: 1},
// 	key7: {b: {d: 2}},
// };
//


// function queryStringify(data: StringIndexed, prefix: string = ''): string | never {
// 	if(typeof data !== 'object' || data===null){
// 		throw new Error('input must be an object');
// 	}
// 	let getString='';
// 	for(const key in data){
// 		if(typeof data[key] === 'object' && typeof data[key]!==null){
// 			let newPrefix;
// 			if(prefix.length>0){
// 				newPrefix=`${prefix}[${key}]`;
// 			}else{
// 				newPrefix=key;
// 			}
// 			getString+=queryStringify(data[key], newPrefix);
// 		}else{
// 			if(prefix.length>0){
// 				getString+=`${prefix}[${key}]=${data[key]}&`;
// 			}else{
// 				getString+=`${key}=${data[key]}&`;
// 			}
// 		}
// 	}
// 	if(prefix===''){
// 		getString=getString.substring(0, getString.length-1);
// 	}
// 	return getString;
// }
//
// const a = queryStringify(obj);
// console.log(a);

// Ёлочка
//
// type Nullable<T> = T | null;
// const TYPE_ERROR = 'Something wrong with type of input param';
//
// const tree = (lvl: number | string | null): Nullable<string> => {
// 	const star = '*';
// 	const space = ' ';
// 	const trunk = '|';
// 	if (typeof lvl !== 'number' && typeof lvl !== 'string') {
// 		throw new Error(TYPE_ERROR);
// 	}
// 	const level: number = typeof lvl === 'number' ? lvl : parseInt(lvl);
// 	let output: string = '';
// 	if (level >= 3) {
// 		const lineWidth = 1 + ((level - 2) * 2);
// 		let thisLineStars: number = 1;
// 		for (let currentLevel: number = 1; currentLevel < lvl; currentLevel++) {
// 			const stars = star.repeat(thisLineStars);
// 			const spaces = space.repeat((lineWidth - thisLineStars) / 2);
// 			const currentLine = `${spaces}${stars}${spaces}`;
// 			output += `${currentLine}\n`;
// 			thisLineStars += 2;
// 		}
// 		const spaces = space.repeat((lineWidth - 1) / 2);
// 		const lastLine = `${spaces}${trunk}${spaces}`;
// 		output += `${lastLine}\n`;
// 		return output;
// 	}
// 	return null;
// };

// Наибольший общий делитель
// const euclid = (...args: number[]): number => {
// 	const argsCount = args.length;
// 	let output: number | undefined;
//
// 	if (argsCount < 1) {
// 		throw new Error('Не указаны числа для euclid');
// 	}
//
// 	if (argsCount === 1) {
// 		output = args[0];
// 	}
//
// 	for (let a = 0; a < argsCount; a++) {
// 		if (!(args[a] === Math.abs(args[a]))) {
// 			output = -1;
// 		}
// 	}
//
// 	function euclidForTwo(a: number, b: number) {
// 		let x = Math.abs(a);
// 		let y = Math.abs(b);
// 		while (y) {
// 			const t = y;
// 			y = x % y;
// 			x = t;
// 		}
// 		return x;
// 	}
//
// 	if (output === undefined) {
// 		for (let a = 0; a < argsCount - 1; a++) {
// 			for (let b = a + 1; b < argsCount; b++) {
// 				const e = euclidForTwo(args[a], args[b]);
// 				if (output === undefined || output > e) {
// 					output = e;
// 				}
// 			}
// 		}
// 	}
//
// 	if (output === undefined) {
// 		throw new Error('Произошка ошибка в  euclid');
// 	}
// 	return output;
// }
// const a = euclid(6006, 3738735, 51051);
// console.log(a);


// Каррирование
// type StepFn = (val: number) => number | StepFn;
//
// function add(val: number): number | StepFn {
// 	let sum = 0;
// 	const nextAdd = (val: number): number | StepFn => {
// 		console.log('nextAdd', val, sum);
// 		// if (val) {
// 			sum += val;
// 			console.log('return function');
// 			return nextAdd;
// 		// }
// 		// console.log('return sum');
// 		// return sum;
// 	};
// 	return nextAdd(val);
// };
//
// console.log('x', add(1));


// class ValidationError extends Error {
// 	constructor(message:string) {
// 		super(message);
// 		this.name='ValidationError';
// 	}
// }
//
// function take<T>(list: T[], num: number = 1): T[] {
// 	if(!(list instanceof Array && typeof num === 'number')){
// 		throw new ValidationError('bad value');
// 	}
// 	return list.slice(0,num);
// }
//
// const a = take([1, 2, 3], 'asd');
// console.log(a)


// function unzip<T>(...args: T[][]) {
// 	const output:any[] = [];
// 	const outputLength = Math.max(...args.map(arr => arr.length));
// 	for(let i=0; i<outputLength; i++){
// 		output[i]=Array(args.length).fill(undefined);
// 		args.map((arg, key) => {
// 			if (!(arg instanceof Array)) {
// 				throw new Error(`${args[key]} is not array`);
// 			}
// 			if(arg[i]){
// 				output[i][key]=arg[i];
// 			}
// 		});
// 	}
// 	return output;
// }
//
// const a = unzip([1, 2, 3], [4], [5, 6]);
// console.log(JSON.stringify(a));
// console.log('[[1, 4, 5], [2, undefined, 6], [3, undefined, undefined]]');
// console.log(a);

// unzip([1], [1, 2, 3], [4, 6, 7, 8, 9]);
// [1, 			1, 			4]
// [undefined, 	2, 			6]
// [undefined, 	3, 			7]
// [undefined, 	undefined, 	8]
// [undefined, 	undefined, 	9]
