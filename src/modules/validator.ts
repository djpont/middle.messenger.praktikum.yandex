import Input from "~src/components/input";
import Alert from "~src/components/window/alert";

// Модуль валидации.

const regexpsRules: Record<string, { regexp: RegExp, description: string }> = {
	first_name: {
		regexp: /^[А-ЯЁA-Z][а-яёa-z-]*$/,
		description: "Латиница или кириллица, первая буква должна быть заглавной," +
			"без пробелов и без цифр, нет спецсимволов (допустим только дефис)."
	},
	second_name: {
		regexp: /^[А-ЯЁA-Z][а-яёa-z-]*$/,
		description: "Латиница или кириллица, первая буква должна быть заглавной," +
			"без пробелов и без цифр, нет спецсимволов (допустим только дефис)."
	},
	email: {
		regexp: /^[a-zA-Z0-9._-]+@[a-zA-Z._-]+\.[a-zA-Z]{2,}$/,
		description: "Латиница, может включать цифры и спецсимволы вроде дефиса," +
			"обязательно должна быть «собака» (@) и точка после неё," +
			"но перед точкой обязательно должны быть буквы."
	},
	phone: {
		regexp: /^\+?[0-9]{10,15}$/,
		description: "От 10 до 15 символов, состоит из цифр, может начинается с плюса."
	},
	login: {
		regexp: /^(?=.*[a-zA-Z])([a-zA-Z0-9-_]{3,20})$/,
		description: "От 3 до 20 символов, латиница, может содержать цифры,но не состоять из них," +
			"без пробелов, без спецсимволов (допустимы дефис и нижнее подчёркивание)."
	},
	password: {
		regexp: /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,40}$/,
		description: "От 8 до 40 символов, обязательно хотя бы одна заглавная буква и цифра."
	},
	message: {
		regexp: /^.+$/,
		description: "Сообщение не должно быть пустым."
	}
}
export default class Validator {

	// Метод валидации. Возвращает boolean успеха и описание
	public static validate(rule: string, value: string): { valid: boolean, description: string } {
		if (!regexpsRules[rule]) {
			throw new Error(`Validator не имеет правила ${rule}`);
		}
		return {
			valid: regexpsRules[rule].regexp.test(value),
			description: regexpsRules[rule].description
		}
	}

	// Метод валидации с показом ошибки пользователю. Возвращает boolean успеха.
	public static validateInputWithAlert(...inputs: Input[]): boolean {
		let result: boolean = true;
		const errorTexts: string[] = [];
		inputs.forEach(input => {
			const rule = input.props.name;
			const value = input.props.value;
			const validated = Validator.validate(rule, value);
			if (!validated.valid) {
				result = false;
				let text = validated.description;
				if(input.props.label){
					text=`Неверно заполнено поле ${input.props.label}<br>${text}`;
				}
				errorTexts.push(text);
			}
		});
		// Если валитация не прошла, то показываем пользователю ошибку
		if(!result){
			Alert.lastAlert().error(errorTexts);
		}
		return result;
	}

	// Метод валидации равности значений двух инпутов (для пароля)
	public static equalInput(inputs: Input[]): boolean {
		let result: boolean = true;
		inputs.forEach(input => {
			if(input.props.value!==inputs[0].props.value){
				result=false;
			}
		});
		return result;
	}

}
