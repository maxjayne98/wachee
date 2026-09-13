# wachee

A lightweight, beautiful TV show discovery and tracking application built with **Vue 3** (v3.5+) and **TypeScript**.

## Dependencies

This project is built to be extremely lightweight. Aside from the core Vue ecosystem (Vue Router and Pinia), it has **zero external dependencies**! All styling is handled purely by **Tailwind CSS**.

## File Structure

- App.vue: all pages are enclosed by this component.
- main.ts: in this file we initialize our Vue application and attach it to our HTML file.
- api: API call methods are in this folder.
- assets: stylesheet files including custom css styles.
- components
  - app
    Contains our reusable components which are used among all the pages in our application.
  - base
    The basic UI components are in this folder.
  - pages
    Each page has a specific folder.
  - shared
    Shared components used across multiple views.
- composables: shared Vue logic that can be used in our components.
- router: contains router specification file.
- store: contains Pinia stores for global state management.
- types: contains TypeScript definitions.
- utils: contains functionalities that do not use any vue related hooks.
- views: contains our main route components.

## Node version

Node version that is used in this project is version 24 and you can simply run this command to run the required node version if you have nvm installed.

```sh
nvm use
```

## Package Manager

This project uses **pnpm**. Ensure you have it installed:

```sh
npm install -g pnpm
```

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm run build
```
