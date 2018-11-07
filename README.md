# Gun Violence
Team: Able Shi and Roger Li
## Project Topic
Our project seeks to find any trends related to mass shootings, police shootings, and gun violence in the United States. If trends exist, then we want to analyze the relationships and how they trend across the entire country.

## Background and Motivation
It seems like mass shootings and police brutality are increasingly occurring on media outlets. We would like to determine whether this is truly due to increased gun violence, or increased media coverage. Either way, we would also like to examine the relationships of police shootings, mass shootings, and gun violence between each other and also over time.

## Objectives
We want to examine different gun violence trends over time and across the United States. We want to create a UI that'll be user-friendly and effective. We hope to be able to see some surprising relationships or even surprising non-relationships.

## Data
We are aggregating three different data sources - [mass shootings](https://www.kaggle.com/jlmontie/stanford-msa-2017/home), [fatal police shootings](https://www.kaggle.com/kwullum/fatal-police-shootings-in-the-us), and [general gun violence](https://www.kaggle.com/jameslko/gun-violence-data). These datasets were gathered through public datasets.

## Data Processing
We will display the data on a Choropleth map using map data (.shp) from the [US Census](https://www.census.gov/geo/maps-data/data/tiger-cart-boundary.html) that has been converted to JSON for use in our project.

Since we are aggregating data from three different sources, some data processing will need to be completed in order to ensure our visualization displays consistent data (e.g. consistent location data elements). Data is already organized in `.csv` files so we suspect  filtering out the data elements of interest from all three sources will be a fairly straightforward process.

Furthermore, we would like to explore the possibility of extrapolating data from our original sources. In particular, we would like to derive density as an estimation. This could add some nice features such as clustering which we will mention further in the next section.

Overall, we hope to complete data processing well within a week.

## Must-Have Features
The first feature we hope to implement will be individual datasets mapped over time. We will have three layers of data that the user can toggle and a slider to indicate time. The user can adjust the dataset and slider to see the instantaneous and continuous change in data over time across the United States.

The second feature would be zoom-in features. The user should be able to click on a state and this will zoom into the desired state. The state will be more detailed with county lines. Big cities will be marked on the map.

## Optional Features

## Project Schedule

## Visualization Design
