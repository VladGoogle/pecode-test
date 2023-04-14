
# Project Title

Test task for Pecode



## Pre-conditions
Install dependencies using this command:
```bash
yarn
```
or
```bash
npm i
```
if you don't have a yarn package manager installed in your OS


## Running Tests

To run all specs, run the following command

```bash
  yarn test:run
```

To run a single spec, run the following command
```bash
yarn playwright test <spec_name>
```

## Generate Reports
NOTE: You may need to set up JAVA_HOME env variable into your OS to successfully generate Allure Reports. Depending, which OS you are using, the process could be different

To generate Allure report, run the following command
```bash
yarn allure:open
```
To generate Playwright HTML report, run the following command
```bash
yarn html:open
```