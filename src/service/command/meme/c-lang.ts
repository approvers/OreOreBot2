import type {MemeTemplate} from "../../../model/meme-template.js";

export const cLang: MemeTemplate<never, never> = {
    commandNames: ["clang", "c"],
    description: "〜の天才\n9つの〜を操る",
    flagsKeys: [],
    optionsKeys: [],
    errorMessage: 'memeの天才\n9つの構文を操る',
    generate(args) {
        const [option1, option2] = args.body.split(' ')
        return `${option1}の天才\n9つの${option2}を操る`
    }
}
