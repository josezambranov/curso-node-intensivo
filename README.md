# curso-node-intensivo

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.2.10. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
############################# notas ###################################
curso dictado por : https://www.youtube.com/watch?v=z4x1OGfJkek&t=2087s

tecnologias

    eslint --> https://eslint.org/
    reglas de arbnb --> https://github.com/airbnb/javascript
    flag configuration
    bun correr node --> https://bun.sh/
    jwt
    valibot --> https://valibot.dev/
        porque usar valibot --> moderna, facil de usar y mas rapido que zod

Paso 1
    inicializar el proyecto
        bun init
paso 2 
    inicializar eslint
        npx eslint --init
        configuracion
            √ What do you want to lint? · javascript
            √ How would you like to use ESLint? · problems
            √ What type of modules does your project use? · esm
            √ Which framework does your project use? · none
            √ Does your project use TypeScript? · no / yes
            √ Where does your code run? · node
            The config that you've selected requires the following dependencies:

            eslint, @eslint/js, globals, typescript-eslint
            √ Would you like to install them now? · No / Yes
            √ Which package manager do you want to use? · bun
paso 3
    instalar dependencia
        bun add bcrypt cors jsonwebtoken valibot

            bcrypt --> encriptar y desencriptar 
            cors --> comunicacion entre diferentes dominios
            jsonwebtoken --> token
            valibot
paso 4
    dependencias de desarrollo
        bun add -D @eslint/js @types/node @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-config-airbnb-base eslint-config-airbnb-base-typescript eslint-plugin-import eslint-plugin-unused-imports

            @eslint/js --> linter house mientras codificamos
            @types/node
            @typescript-eslint/eslint-plugin --> eslint de soporte a ts
            @typescript-eslint/parser
            eslint-config-airbnb-base
            eslint-config-airbnb-base-typescript

 
consultar:
-inferercina de tipos : 
    escribir todo el esquema y tranformarclo a un tipo de javascrpit