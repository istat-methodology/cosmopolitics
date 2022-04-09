# Cosmopolitics

Cosmopolitics has been implemented by Istat's Team in the context of the **European Big Data Hackathon 2021** organized by Eurostat. 

Cosmopolitics is an open source dashboard implemented using modern javascript frameworks ([Vue.js](https://vuejs.org/ "Vue.js")) and microservice architecture for the server components (currently we use Docker Containers). The implemented architecture is scalable and allows to integrate Python and R languages in a data processing pipeline.

Cosmopolitics was awarded **first place** at the European Big Data Hackathon 2021. Istat's team pitching is available on [vimeo](https://vimeo.com/525488078) 

## Core functionalities
Cosmopolitics offers a set of functionalities that allow to analyse international trade relations both at macro and micro level. 
At macro level using social networks analysis techniques (*implemented in Python*) we investigated both the effect of **shocks in transportation** and the **effects of relation disruptions**. 
At micro level analysing google mobility data we provide an indicator (*implemented in R*) representing the restriction imposed by COVID pandemic. This indicator has been used to perform an analysis to: 
- evaluate the effects of pandemic in import and export;
- nowcast and forecast new scenario derived by mobility policies.

Cosmopolitics provides the following functionalities
- **Interactive map**: with a focus to the recent pandemic the Team provides for each country a set of macro – economic indicators together with the total value of import and export. Moreover to focus the analysis on the trade market for each of the 27 EU countries Cosmopolitics provides: i) the percentage of total import and export represented by the three main good exchanged (in import and export); ii) the percentage with respect to the total (of the import and export with respect to the three main partners). Moreover the interactive map displays the percentage variation in import and export with respect to November 2020. The analysis is based on *COMEXT and Eurostat data*.
- **Mobility policy analysis**: this function given the mobility data available from google provides two different results: i) descriptive analysis of the main mobility index for the selected country: Retail, Grocery and Pharmacy, Parks, Transit Station, Workplaces, Residential; ii) provide a daily and a monthly mobility policy indicator whose value rage
is 0–1 representing the level of restriction imposed by the selected country government.
- **Covid-19 impact evaluation on international trade**: given a Country and Partner Cosmopolitics offers a set of descriptive statistics representing the trade
situation between the two countries in the period before and after a specific reference date (suggested by the user). This functionality allows to analyse graphically and quantitatively the Covid-19 monthly impact on import and export time series in value. The user can choose a country and select a single BEC at 1-digit level or totals. Moreover it is possible to require a nowcasting to the actual date, or a forecasting of the series connected to possible scenario of mobility restriction introduced directly by the user. The Team used the interrupted time series analysis to estimate the effect of mobility restriction imposed by each government to the import and the export with respect to a country and detailed by broad economic categories (bec). *The analysis is based on COMEXT and Google Mobility Data*
- **Graph analysis**: the Team used *Monthly COMEXT data by Means of Transport* to build the graph of international trade relations and use standard graph measures to characterize the relations structures. The Team built an interactive page to visualize all the measures and functionalities derived from the graph analysis. A detailded description of the function is available [here](https://github.com/istat-methodology/cosmopolitics/blob/main/docs/Cosmopolitics%20Graph%20Analysis.pdf). 
- **Trade**: Member State monthly imports and exports have been decomposed in terms of traded products in order to give a picture of trade trends under the Covid-19 pandemic in a short-term perspective. Despite the global drop of international trade during the pandemic, a strong heterogeneity across traded products is observed by computing year-over-year monthly percentage changes for each considered product class. Indeed, for each Member State, the critical pandemic months show an increase of share in the export
of non-durable consumer goods, such as pharmaceutical products, chemicals or floods and beverage, and at the same time a drop in export of durable consumer goods or investment goods, such as motor vehicles, trailers and semi-trailers. On the other hand, the import side shows an increase of share for products needed to fight against coronavirus, such as textiles (facial masks). Since for most Member State the heterogeneity is strong localized during the pandemic waves, the indicators provide a clear picture of national deficit or surplus of specific products most needed at crisis time. The input data source consists in Comext monthly dataset by products, where Member State trade classified
according to CPA2.1 at 2 digits classification level was considered. Comext data were appropriately transformed in order to get, for each Member State, shares of CPA product divisions on total export and import, and finally compute year-over-year (YOY) changes of such shares during 2020.

## Installation
If you are curious about our work and want to play with Cosmopolitcs, clone the repo and execute the following command
`docker-compose up -d`
then open the browser at the following url
`http://localhost:8070`
Now you can have great fun!
