<p align="center">
  
  ![Cover](https://raw.githubusercontent.com/wiki/Clean-CaDET/platform/images/overview/cover.jpg)
  
</p>

<h1 align="center">Clean CaDET</h1>

<p align="justify">
  The Clean Code and Design Educational Tool (Clean CaDET) is a platform dedicated to the study of clean code. It presents a conglomerate of AI-powered tools for educators, learners, practitioners, and researchers studying clean code. The repository for the platform with which this plugin interacts can be found <a href="https://github.com/Clean-CaDET/platform" target="_blank">here</a>.
  </p>

<h2 align="left">Visual Studio Code Plugin</h1>

<p align="justify">
  This repository hosts the code for the Visual Studio plugin capable of interacting with the platform, enabling the following use cases:
  <ul align="justify">
    <li align="justify"><i>Studying clean code challenges</i>, where the learner loads a predefined C# project focused around some aspect of clean code (e.g., meaningful names, focused methods) and is tasked with refactoring the code in some way. How our platform resolves these challenge submissions is described <a href="https://github.com/Clean-CaDET/platform/wiki/Module-Smart-Tutor#challenges" target="_blank">here</a>.</li>
    <li align="justify"><i>Analyzing a project's code quality</i>, where an engineering can submit any C# project (or some subset, such as a folder or class) to the platform for analysis. The platform detects code issues using AI detectors, and selects appropriate learning objects to display to the engineer and help them resolve the identified issues. This data flow is described in more detail <a href="https://github.com/Clean-CaDET/platform/wiki" target="_blank">here</a>.</li>
  </ul>
</p>

## Requirements

This plugin is used to access educational content and send challenge solutions to the Clean CaDET platform. Users need to connect to an existing platform or setup a local instance of it.

To setup the platform:

- Download [the platform](https://github.com/Clean-CaDET/platform) and setup its database of initial educational content.

## Extension Settings

This extension contributes the following settings:

* `platform.tutorUrl`: Specifies the base URL for the Smart Tutor endpoints.

## Release Notes

### 0.0.1

Initial release of plugin used for a controlled experiment with university students.
