# UI5con 2022 Demo

Demo for UI5con 2022 showcasing different uses of the same component.

1. Standard use case: embedding a list-detail component (uimodel/webapp/components/data) in a UI5 application (uimodel/webapp) and accessing it via routing (in app: "Component (Blue)"). Some very basic dirty-state handling is included.
2. Different operating modes: configuring the component behaviour using componentData. A second component instance ("Component (Red)") allows to reuse all of the component's functionality but operates e.g. on slightly different data. (Other small deviations in functionality may be included as well; imagine a sufficiently complex component for this to make sense)
3. Different output formats for embedding: the same component is exposing specialised views (uimodel/webapp/components/data/embeddable) for embedding it in different places and for specific purposes. In this sample: a button with a counter e.g. for use in a header and a list card for use in a dashboard. All data handling is still retained in the list-detail component itself.

## Run the app and see for yourself

Run `npm install`

Run `npm start`

Open http://localhost:8081/index.html (should open automatically)

See comments in source code to discover and recreate potential pitfalls

## Contact

If you have any questions or feedback, please contact me:

Andreas Pflugrad <andreas.pflugrad@exxcellent.de>

https://www.exxcellent.de

## Credits

Thanks to the UI5 community and all active contributors who keep improving the framework so diligently.

This project has been generated with 💙 and [easy-ui5](https://github.com/SAP)
