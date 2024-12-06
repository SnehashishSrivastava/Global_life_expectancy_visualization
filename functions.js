const iso3ToIso2 = {
    "USA": "US",
    "IND": "IN",
    "GBR": "GB",
    "CHN": "CN",
    "FRA": "FR",
    "DEU": "DE",
    "JPN": "JP",
    "CAN": "CA",
    "AUS": "AU",
    "ITA": "IT",
    "BRA": "BR",
    "RUS": "RU",
    "MEX": "MX",
    "ZAF": "ZA",
    "KOR": "KR",
    "ESP": "ES",
    "SAU": "SA",
    "TUR": "TR",
    "ARG": "AR",
    "NLD": "NL",
    "EGY": "EG",
    "SWE": "SE",
    "NOR": "NO",
    "CHE": "CH",
    "POL": "PL",
    "DNK": "DK",
    "BEL": "BE",
    "PRT": "PT",
    "AUT": "AT",
    "SGP": "SG",
    "FIN": "FI",
    "ISR": "IL",
    "NGA": "NG",
    "THA": "TH",
    "KWT": "KW",
    "GRC": "GR",
    "COL": "CO",
    "ROU": "RO",
    "HUN": "HU",
    "CHE": "CH",
    "ARE": "AE",
    "PHL": "PH",
    "HRV": "HR",
    "CZE": "CZ",
    "SVK": "SK",
    "LTU": "LT",
    "EST": "EE",
    "LVA": "LV",
    "BGR": "BG",
    "LUX": "LU",
    "MDA": "MD",
    "ISL": "IS",
    "ZWE": "ZW",
    "BHR": "BH",
    "OMN": "OM",
    "MYS": "MY",
    "BOL": "BO",
    "VNM": "VN",
    "DOM": "DO",
    "PER": "PE",
    "GUY": "GY",
    "CUB": "CU",
    "LKA": "LK",
    "ECU": "EC",
    "UGA": "UG",
    "LKA": "LK",
    "MWI": "MW",
    "CMR": "CM",
    "SOM": "SO",
    "TUN": "TN",
    "UGA": "UG",
    "GHA": "GH",
    "KEN": "KE",
    "TGO": "TG",
    "SEN": "SN",
    "ETH": "ET",
    "MOZ": "MZ",
    "BDI": "BI",
    "CPV": "CV",
    "MDG": "MG",
    "STP": "ST",
    "LBR": "LR",
    "TJK": "TJ",
    "AZE": "AZ",
    "MNG": "MN",
    "KGZ": "KG",
    "UZB": "UZ",
    "TKM": "TM",
    "LKA": "LK",
    "MMR": "MM",
    "PRK": "KP",
    "KHM": "KH",
    "BTN": "BT",
    "MDG": "MG",
    "VUT": "VU",
    "WSM": "WS",
    "PLW": "PW",
    "MHL": "MH",
    "FJI": "FJ",
    "TON": "TO",
    "FSM": "FM",
    "SPM": "PM",
    "KIR": "KI",
    "VIR": "VI",
    "MNP": "MP",
    "NCL": "NC",
    "NFK": "NF",
    "GUM": "GU",
    "AS": "AS",
    "PRI": "PR",
    "GRL": "GL",
    "HMD": "HM",
    "AIA": "AI",
    "BES": "BQ",
    "SHN": "SH",
    "SGS": "GS",
    "SLV": "SV",
    "FSM": "FM",
    "GMB": "GM",
    "LCA": "LC",
    "TTO": "TT",
    "STP": "ST",
    "BEN": "BJ",
    "REU": "RE",
    "PRY": "PY",
    "DMA": "DM",
    "SYR": "SY",
    "IRL": "IE",
    "BHS": "BS",
    "ARG": "AR",
    "GAB": "GA",
    "GUY": "GY",
    "TJK": "TJ",
    "FJI": "FJ",
    "GRD": "GD",
    "GUY": "GY",
    "BFA": "BF",
    "ATG": "AG",
    "MDV": "MV",
    "NER": "NE",
    "TGO": "TG",
    "COG": "CG",
    "LKA": "LK",
    "DJI": "DJ",
    "ERI": "ER",
    "GHA": "GH",
    "HTI": "HT",
    "GTM": "GT",
    "BEN": "BJ",
    "LBR": "LR",
    "SPM": "PM",
    "SMR": "SM",
    "BRN": "BN",
    "TUR": "TR"
};
function transitionProjection(newProjection, geojson, currentYear, selectedCountries) {
    const duration = 2000;
    const interpolate = d3.geoInterpolate(currentProjection.center(), newProjection.center());
    const scaleInterpolate = d3.interpolate(currentProjection.scale(), newProjection.scale());
    const rotateInterpolate = d3.interpolate(currentProjection.rotate(), newProjection.rotate());

    d3.transition()
        .duration(duration)
        .tween("projection", function () {
            return function (t) {
                currentProjection
                    .center(interpolate(t))
                    .scale(scaleInterpolate(t))
                    .rotate(rotateInterpolate(t));
                path = d3.geoPath().projection(currentProjection);
                svg.selectAll("path")
                    .attr("d", path); // Update country paths

                // Update positions of additional elements (like SVG circles/icons)
                svg.selectAll(".country-marker")
                    .attr("cx", d => currentProjection(d.coordinates)[0])
                    .attr("cy", d => currentProjection(d.coordinates)[1]);
            };
        })
        .on("end", () => {
            currentProjection = newProjection;
            if (newProjection === orthoProjection) {
                draw_run_globe(geojson, currentYear, selectedCountries, newProjection);
            } else if (newProjection === mercatorProjection) {
                draw_run_map(geojson, currentYear, selectedCountries);
            }
        });
}

// Example of adding SVG elements (e.g., markers on countries)
function addCountryMarkers(data) {
    svg.selectAll(".country-marker")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "country-marker")
        .attr("r", 5)
        .attr("fill", "red")
        .attr("cx", d => currentProjection(d.coordinates)[0])
        .attr("cy", d => currentProjection(d.coordinates)[1]);
}

// function transitionProjection(newProjection, geojson, currentYear, selectedCountries) {
//     stopRotation(); // Stop rotation during the transition
//     const duration = 2000; // Transition duration in ms
//     const interpolate = d3.geoInterpolate(currentProjection.center(), newProjection.center());
//     const scaleInterpolate = d3.interpolate(currentProjection.scale(), newProjection.scale());
//     const rotateInterpolate = d3.interpolate(currentProjection.rotate(), newProjection.rotate());

//     d3.transition()
//         .duration(duration)
//         .tween("projection", function() {
//             return function(t) {
//                 currentProjection
//                     .center(interpolate(t))
//                     .scale(scaleInterpolate(t))
//                     .rotate(rotateInterpolate(t));
//                 path = d3.geoPath().projection(currentProjection);
//                 redrawMap(); // Update the paths during the transition
//             };
//         })
//         .on("end", () => {
//             currentProjection = newProjection;
//             if (newProjection === orthoProjection) {
//                 // Run the globe-specific logic
//                 draw_run_globe(geojson, currentYear, selectedCountries, newProjection);
//                 if (rotating) startRotation(); // Resume rotation if required
//             } else if (newProjection === mercatorProjection) {
//                 // Run the map-specific logic
//                 draw_run_map(geojson, currentYear, selectedCountries);
//             }
//         });
// }
function draw_run_globe(geojson, currentYear ,selectedCountries,projection){
    // let projection = d3.geoOrthographic()
    //     .scale(300)
    //     .translate([width / 2, height / 2])
    //     .clipAngle(90)
    //     .precision(0.6);
    // let path = d3.geoPath().projection(projection);
    drawGlobe(geojson, currentYear ,selectedCountries);

                // Start the rotation animation
                rotateGlobe(geojson, currentYear);

                // Add heatmap legend
                addLegend(); 

                // Enable dragging interaction
                enableDragging(projection);
                setupCountryControls(geojson);
                yearcontrol(geojson);
                svg.on("mouseover", function() {
   
   rotating = false;
});
svg.on("mouseout", function() {
// Hide the tooltip when the mouse leaves the country
rotating = true;
// tooltip.style("display", "none");
});

}

function draw_run_map(geojson, currentYear ,selectedCountries){
    const mapprojection = d3.geoMercator()
    .scale(150)
    .translate([width / 2, height / 1.5]);
const path = d3.geoPath().projection(mapprojection);
    drawmap(geojson,currentYear,selectedCountries);
    setupCountryControls_map(geojson);
    yearcontrol_map(geojson);
    incrementYearAndDrawMap(geojson);
    addLegend();
}
function drawmap(geojson,year,selectedCountries){
    svg.selectAll(".path").remove();
    svg.selectAll(".bar-chart").remove();
    // d3.select("#plot").remove();
        // console.log(lifeExpectancyData);
        // const lifeExpMap = new Map(lifeExpectancyData.map(d => [d.Code, +d.Life_expectancy]));
        const filteredData = lifeExpectancyData.filter(d => +d['Year'] == year  && 
            (selectedCountries.length === 0 || selectedCountries.includes(d.Code)));
            const countryData = {};
            filteredData.forEach(d => {
                // console.log(d)
                countryData[d['Entity']] = {
                    lifeExpectancy: +d['Life_expectancy'],
                    gdpa: +d['%gdpa'],
                    vaccinated: +d['%vaccinated']
                };
            });
        console.log("Country Data Lookup:", countryData);
            // const lifeExpScale = d3.scaleSequential(d3.interpolateRgb.gamma(1.2)("orange","green")) // A color scale for life expectancy
        //     let colorScale =d3.scaleSequential(d3.interpolateRgb.gamma(1.2)( "red","green"))
        // .domain(d3.extent(lifeExpectancyData, d => +d.Life_expectancy));
        
        const zoom = d3.zoom()
        .scaleExtent([1, 8]) // Define zoom range
        .on("zoom", function (event) {
            svg.select(".map").attr("transform", event.transform);
        });

    // Apply zoom behavior to SVG
    svg.call(zoom);
    let clickCount = 0;

    // Create a group for the map
    // const mapGroup = 
    svg.append("g")
        .attr("class", "map");
            // Clear the previous map and draw new paths
            svg.selectAll(".bar-chart").remove();
            svg.selectAll(".map").remove();
            svg.append("g")
                .selectAll("path")
                .data(geojson.features)
                .enter().append("path")
                .attr("d", path)
                .attr("fill", d => {

                    // console.log(d);
                    const countryCode = d.properties.name;
                    const lifeExp = countryData[countryCode]?.lifeExpectancy;
                    // let color = colorScale(lifeExp);
                    // console.log("h`e`r`e:" ,countryCode,lifeExp);
                return  lifeExp ? colorScale(lifeExp) : "#ccc";;  // Return the adjusted color
            })   
            .attr("stroke", "#fff")
                .on("mouseover", function(event, d) {
            // Get the country code for the hovered country
            rotating=false;
            const countryCode = d.properties.name;
            
            //  console.log(countryData,countryCode);
            // rotating = false;
            // Get the life expectancy, GDP, and vaccinatio200n data for the country
            const lifeExp = countryData[countryCode]?.lifeExpectancy;
            const gdpa = countryData[countryCode]?.gdpa;
            const vaccinated = countryData[countryCode]?.vaccinated;
            // if(countryCode==undefined){
            // console.log("thisone",d,countryData);
            // }
                    
            // projection.rotating=false;

            // Only show the tooltip if any data is available for the country
            if (lifeExp !== undefined || gdpa !== undefined || vaccinated !== undefined) {
                // Construct the tooltip content
                // console.log(d.properties);
                let tooltipContent = `<strong>${d.properties.name}</strong><br>`;
                tooltipContent += `Life Expectancy: ${lifeExp}<br>`;
                tooltipContent += `Vaccinated: ${vaccinated}%`;
                tooltipContent += `GDP: ${gdpa}%<br>`;
                
        

                // Display the tooltip with the data
                tooltip.style("display", "block")
                    .html(tooltipContent);
            }
        })
        .on("mousemove", function(event) {
            // Move the tooltip to follow the mouse
            rotating = false;
            tooltip.style("left", (event.pageX + 10) + "px")
                   .style("top", (event.pageY - 30) + "px");
        })
        .on("mouseout", function() {
            // Hide the tooltip when the mouse leaves the country
            rotating = true;
            tooltip.style("display", "none");
        })
        .on("dblclick", function (event) {
        scale = Math.min(2 * 1.5, 8); // Limit zoom-in scale
        const transform = d3.zoomIdentity.scale(scale);
        svg.transition().duration(500).call(zoom.transform, transform);
    }).on("click", function () {
        
        clickCount++;
        setTimeout(() => {
            if (clickCount === 3) {
                scale = Math.max(scale / 1.5, 1); // Limit zoom-out scale
                const transform = d3.zoomIdentity.scale(scale);
                svg.transition().duration(500).call(zoom.transform, transform);
            }
            clickCount = 0;
        }, 400);
    });
    

        
    }
    function incrementYearAndDrawMap(geojson) {
    // Define the current year globally within the function
    // let currentYear = 2000; 

    // The function that updates the year and redraws the map
    function update() {
        svg.selectAll(".bar-chart").remove();
    if (rotating) {
        // console.log(`Current Year: ${currentYear}`);

        // Increment the year, reset to 2000 if it exceeds 2020
        currentYear = currentYear < 2020 ? currentYear + 1 : 2000;

        // Update the year input field
        const yearInput = d3.select("#year-input");
        if (yearInput.node()) {
            yearInput.node().value = currentYear;
        }

        // Redraw the map with the updated year
        drawmap(geojson, currentYear, selectedCountries);

        // Schedule the next update
        setTimeout(update, duration);
    }
}
update();
}
function yearcontrol_map(geojson){
            const yearInput = d3.select("#year-input");
                const playButton = d3.select("#play-button");

                yearInput.on("change", function () {
                    const enteredYear = +this.value;
                    if (enteredYear >= 2000 && enteredYear <= 2020) {
                        currentYear = enteredYear;
                        rotating = false; // Stop rotation
                        drawmap(geojson, currentYear, selectedCountries);
                    } else {
                        alert("Please enter a year between 2000 and 2020.");
                        this.value = currentYear; // Reset input to the current year
                    }
                });
        playButton.on("click", function () {
        rotating = !rotating; // Toggle automatic updates
        if (rotating) {
            playButton.text("Pause");
            incrementYearAndDrawMap(geojson);
        } else {
            playButton.text("Play");
        } // Pass the updated input element
                });
            };
    function setupCountryControls_map(geojson) {
            const searchBar = d3.select("#search-bar");
            const countryList = d3.select("#country-list");
            const selectAllCheckbox = d3.select("#select-all");
            // console.log("country-control",geojson.features.id);
            // Populate the country list with checkboxes
            geojson.features.forEach(country => {
                const countryCode = country.id;
                const countryName = country.properties.name;
                // console.log(countryCode,countryName);


                const div = countryList.append("div").attr("class", "country-checkbox");
                div.append("input")
                    .attr("type", "checkbox")
                    .attr("id", `checkbox-${countryCode}`)
                    .attr("value", countryCode)
                    .on("change", function() {
                if (this.checked) {
                    selectedCountries.push(countryCode);
                    // console.log(countryCode);
                    drawmap(geojson, currentYear,selectedCountries);
                    // console.log(selectedCountries);
                     // Add country to the selection
                } else {
                    selectedCountries = selectedCountries.filter(c => c !== countryCode);
                    drawmap(geojson, currentYear,selectedCountries);
                     // Remove from the selection
                }
            });
                div.append("label").attr("for", `checkbox-${countryCode}`).text(countryName);
            });

            // Filter country list based on search input
            searchBar.on("input", function() {
                const query = this.value.toLowerCase();
                countryList.selectAll(".country-checkbox").style("display", function() {
                    const countryName = d3.select(this).select("label").text().toLowerCase();
                    return countryName.includes(query) ? "block" : "none";
                });
            });

            // Select or deselect all countries when the "Select All" checkbox is clicked
            
            selectAllCheckbox.on("click", function() {
        const isChecked = this.checked;
        selectedCountries = isChecked ? geojson.features.map(country => country.id) : []; // Clear the array and add all country codes if checked

        // Set the checkboxes state based on "Select All"
        countryList.selectAll("input[type='checkbox']")
            .property("checked", isChecked); // Set all checkboxes to match the "Select All" checkbox state
    }); }
    function drawGlobe(geojson, year,selectedCountries) {
        // Filter data for the current year
        // let path = d3.geoPath().projection(projection);

        svg.selectAll(".bar-chart").remove();
        const filteredData = lifeExpectancyData.filter(d => +d['Year'] == year  && 
        (selectedCountries.length === 0 || selectedCountries.includes(d.Code))
);

        // Create a lookup for life expectancy and other data by country code
        const countryData = {};
        filteredData.forEach(d => {
            countryData[d['Code']] = {
                lifeExpectancy: +d['Life_expectancy'],
                gdpa: +d['%gdpa'],
                vaccinated: +d['%vaccinated'],
                growth: d['growth'] 
            };
        });
        // console.log("Country Data Lookup:", countryData);
        // const lifeExpScale = d3.scaleSequential(d3.interpolateRgb.gamma(1.2)("orange","green")) // A color scale for life expectancy


        // Clear the previous map and draw new paths
        svg.selectAll("path").remove();
        svg.append("g")
            .selectAll("path")
            .data(geojson.features)
            .enter().append("path")
            .attr("d", path)
            .attr("fill", d => {
                const countryCode = d.id;
                const lifeExp = countryData[countryCode]?.lifeExpectancy;
                let color = colorScale(lifeExp);

            // Adjust the brightness based on life expectancy value
            // const brightnessFactor = (lifeExp - 20) / (90 - 20);  // Normalize life expectancy to 0-1 scale
            // const adjustedColor = adjustBrightness(color, 1 + brightnessFactor);  // Apply brightness adjustment

            return color;  // Return the adjusted color
        })          
            .attr("stroke", "#fff")
            .each(function(d) {
                const countryCode = d.id;
                // console.log("Country Code:", countryCode, "GDP:", countryData[countryCode]?.gdpa|| 0, "Vaccinated:", countryData[countryCode]?.vaccinated|| 0);
                const gdpa = countryData[countryCode]?.gdpa || 0;
                const vaccinated = countryData[countryCode]?.vaccinated || 0;
                const gdpaHeight = Math.max(0, gdpaScale(gdpa));  // Ensure non-negative height
                const vaccinatedHeight = Math.max(0, vaccinationScale(vaccinated));
                const growth=countryData[countryCode]?.growth
                // Draw the GDP b
        // console.log(growth);
    if (growth === "False") {
        // Apply blinking animation for countries where growth is false
        d3.select(this)
            .transition()
            .duration(500) // Duration of fade-out
            .style("opacity", 0.2)
            .transition()
            .duration(500) // Duration of fade-in
            .style("opacity", 1)
            .on("end", function repeat() {
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .style("opacity", 0.1)
                        .transition()
                        .duration(200)
                        .style("opacity", 1)
                        .on("end", repeat);
                });}})
            
            .on("mouseover", function(event, d) {
        // Get the country code for the hovered country
            
        const countryCode = d.id;
        rotating = false;
        // Get the life expectancy, GDP, and vaccination data for the country
        const lifeExp = countryData[countryCode]?.lifeExpectancy;
        const gdpa = countryData[countryCode]?.gdpa;
        const vaccinated = countryData[countryCode]?.vaccinated;
        // projection.rotating=false;

        // Only show the tooltip if any data is available for the country
        if (lifeExp !== undefined || gdpa !== undefined || vaccinated !== undefined) {
            // Construct the tooltip content
            let tooltipContent = `<strong>${d.properties.name}</strong><br>`;
            tooltipContent += `Life Expectancy: ${lifeExp}<br>`;
            tooltipContent += `Vaccinated: ${vaccinated}%`;
            tooltipContent += `GDP: ${gdpa}%<br>`;
            
    

            // Display the tooltip with the data
            tooltip.style("display", "block")
                .html(tooltipContent);
        }
    })
    .on("mousemove", function(event) {
        // Move the tooltip to follow the mouse
        rotating = false;
        tooltip.style("left", (event.pageX + 10) + "px")
               .style("top", (event.pageY - 30) + "px");
    })
    .on("mouseout", function() {
        // Hide the tooltip when the mouse leaves the country
        rotating = true;
        tooltip.style("display", "none");
    });

        // console.log("selectedCountries", selectedCountries);
        // svg.append("g").selectAll("path")
        // .data(geojson.features.filter(d => selectedCountries.length==0 || selectedCountries.includes(d.id)))
        // .enter().append("g")
        // Add bar charts for %gdpa and %vaccinated on top of each country
        svg.append("g").selectAll(".bar-chart")
        .data(geojson.features.filter(d => selectedCountries.length==0 || selectedCountries.includes(d.id)))
        .enter().append("g")
            .attr("class", "bar-chart")
            .attr("transform", d => {
let centroid;
    centroid = path.centroid(d);
    
return `translate(${centroid[0] || 0}, ${centroid[1] || 0})`;
})
.style("opacity", d => {
// Make transparent if the centroid is invalid
const centroid = path.centroid(d);
return isNaN(centroid[0]) || isNaN(centroid[1]) ? 0 : 1;
})
            .each(function(d) {
                const countryCode = d.id;
                // console.log("Country Code:", countryCode, "GDP:", countryData[countryCode]?.gdpa|| 0, "Vaccinated:", countryData[countryCode]?.vaccinated|| 0);
                const gdpa = countryData[countryCode]?.gdpa || 0;
                const vaccinated = countryData[countryCode]?.vaccinated || 0;
                const gdpaHeight = Math.max(0, gdpaScale(gdpa));  // Ensure non-negative height
                const vaccinatedHeight = Math.max(0, vaccinationScale(vaccinated));
                // const growth=countryData[countryCode]?.growth


    if (gdpa > 0) {
        d3.select(this).append("rect")
            .attr("width", 5)
            .attr("height", gdpaHeight)
            .attr("x", -10)
            .attr("y", -gdpaHeight)
            .attr("fill", "#1f77b4");
    }

    // Draw the Vaccination bar only if there is non-zero data
    if (vaccinated > 0) {
        d3.select(this).append("rect")
            .attr("width", 5)
            .attr("height", vaccinatedHeight)
            .attr("x", 5)
            .attr("y", -vaccinatedHeight)
            .attr("fill", "#ff7f0e");
    }

    })
}

        // Function to smoothly rotate the globe and change year after a full rotation
        function rotateGlobe(geojson, yearLabel) {
            d3.timer(function() {
                if (rotating) {
                    // Update the rotation angle
                    rotateAngle = (rotateAngle + rotationSpeed) % 360; // Ensure it stays within 0-360 degrees
                    projection.rotate([rotateAngle, 0]);

                    // Redraw the map with the updated rotation
                    svg.selectAll("path").attr("d", path);
                    svg.selectAll(".bar-chart")
                    .attr("transform", d => {
    let centroid;
        centroid = path.centroid(d);
        
    return `translate(${centroid[0] || 0}, ${centroid[1] || 0})`;
})
.style("opacity", d => {
    // Make transparent if the centroid is invalid
    const centroid = path.centroid(d);
    return isNaN(centroid[0]) || isNaN(centroid[1]) ? 0 : 1;
});

                    // Detect when a full rotation (360 degrees) is completed
                    if (Math.abs(rotateAngle) < 1.5) {  // Close to 360 or 0 degrees
                        currentYear = currentYear < 2020 ? currentYear + 1 : 2000; // Cycle between 2000 and 2020
                        const yearInput = d3.select("#year-input");
                        yearInput.node().value = currentYear;
                        drawGlobe(geojson, currentYear,selectedCountries); // Redraw the globe with the new year's data
                    }
                }
            });
        }
        function addLegend() {
    const legendWidth = 200, legendHeight = 10;

    // Create the defs for the gradient
    const defs = svg.append("defs");

    const gradient = defs.append("linearGradient")
        .attr("id", "legend-gradient")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "0%");

    // Define stops for the gradient
    const numStops = 10;
    const colorDomain = colorScale.domain();
    const rangeStep = (colorDomain[1] - colorDomain[0]) / (numStops - 1);

    for (let i = 0; i < numStops; i++) {
        gradient.append("stop")
            .attr("offset", `${(i / (numStops - 1)) * 100}%`)
            .attr("stop-color", colorScale(colorDomain[0] + i * rangeStep));
    }

    // Append the legend group
    const legendSvg = svg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${width - legendWidth - 50}, 100)`);

    // Draw the rectangle filled with the gradient
    legendSvg.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .style("fill", "url(#legend-gradient)");

    // Add a title to the legend
    legendSvg.append("text")
        .attr("class", "legend-title")
        .attr("x", legendWidth / 2)
        .attr("y", -10)
        .style("text-anchor", "middle")
        .text("Life Expectency");

    // Set up the scale for the axis
    const legendScale = d3.scaleLinear()
        .range([0, legendWidth])
        .domain(colorDomain);

    // Define and append the axis
    const legendAxis = d3.axisBottom(legendScale)
        .tickFormat(d3.format(".0f"))
        .ticks(6);

    legendSvg.append("g")
        .attr("class", "legend-axis")
        .attr("transform", `translate(0, ${legendHeight})`)
        .call(legendAxis);
}function enableDragging() {
    let rotate = [0, 0]; // Initial rotation [longitude, latitude]
    let scale = 300; // Adjust this to match your globe's scale
    let projection = d3.geoOrthographic()
        .scale(scale)
        .translate([width / 2, height / 2])
        .clipAngle(90)
        .precision(0.6);
    let path = d3.geoPath().projection(projection);
    svg.call(d3.drag()
        .subject(() => {
            const r = projection.rotate();
            return { x: r[0] / scale, y: -r[1] / scale }; // Map rotation to dragging position
        })
        .on("drag", (event) => {
            const dx = event.dx;
            const dy = event.dy;
            rotate[0] = rotate[0] + dx * 0.5; // Update longitude (X-axis)
            rotate[1] = rotate[1] - dy * 0.5; // Update latitude (Y-axis)
            rotate[1] = Math.max(-90, Math.min(90, rotate[1])); // Clamp latitude to [-90, 90]
            projection.rotate(rotate);
            svg.selectAll("path").attr("d", path);
            // Update positions of bar charts or markers if present
            svg.selectAll(".bar-chart")
            .attr("transform", d => {
    let centroid;
        centroid = path.centroid(d);
        
    return `translate(${centroid[0] || 0}, ${centroid[1] || 0})`;
})
.style("opacity", d => {
    // Make transparent if the centroid is invalid
    const centroid = path.centroid(d);
    return isNaN(centroid[0]) || isNaN(centroid[1]) ? 0 : 1;
});
        })
    );
}
        // Setup the search bar and country list checkboxes
        function setupCountryControls(geojson) {
            const searchBar = d3.select("#search-bar");
            const countryList = d3.select("#country-list");
            const selectAllCheckbox = d3.select("#select-all");

            // Populate the country list with checkboxes
            geojson.features.forEach(country => {
                const countryCode = country.id;
                const countryName = country.properties.name;

                const div = countryList.append("div").attr("class", "country-checkbox");
                div.append("input")
                    .attr("type", "checkbox")
                    .attr("id", `checkbox-${countryCode}`)
                    .attr("value", countryCode)
                    .on("change", function() {
                if (this.checked) {
                    selectedCountries.push(countryCode);
                    drawGlobe(geojson, currentYear,selectedCountries);
                     // Add country to the selection
                } else {
                    selectedCountries = selectedCountries.filter(c => c !== countryCode);
                    drawGlobe(geojson, currentYear,selectedCountries);
                     // Remove from the selection
                }
            });
                div.append("label").attr("for", `checkbox-${countryCode}`).text(countryName);
            });

            // Filter country list based on search input
            searchBar.on("input", function() {
                const query = this.value.toLowerCase();
                countryList.selectAll(".country-checkbox").style("display", function() {
                    const countryName = d3.select(this).select("label").text().toLowerCase();
                    return countryName.includes(query) ? "block" : "none";
                });
            });

            // Select or deselect all countries when the "Select All" checkbox is clicked
            
            selectAllCheckbox.on("click", function() {
        const isChecked = this.checked;
        selectedCountries = isChecked ? geojson.features.map(country => country.id) : []; // Clear the array and add all country codes if checked

        // Set the checkboxes state based on "Select All"
        countryList.selectAll("input[type='checkbox']")
            .property("checked", isChecked); // Set all checkboxes to match the "Select All" checkbox state
    }); }
    function yearcontrol(geojson){
            const yearInput = d3.select("#year-input");
                const playButton = d3.select("#play-button");

                yearInput.on("change", function () {
                    const enteredYear = +this.value;
                    if (enteredYear >= 2000 && enteredYear <= 2020) {
                        currentYear = enteredYear;
                        rotating = false; // Stop rotation
                        drawGlobe(geojson, currentYear, selectedCountries);
                    } else {
                        alert("Please enter a year between 2000 and 2020.");
                        this.value = currentYear; // Reset input to the current year
                    }
                });
                playButton.on("click", function () {
                    rotating = true; // Resume rotation
                    rotateGlobe(geojson, yearInput.node()); // Pass the updated input element
                });
            };
function fisheyeProjection(baseProjection, focus, strength, radius) {
    return {
        stream: function (stream) {
            const baseStream = baseProjection.stream(stream);
            return {
                point: function (x, y) {
                    const dx = x - focus[0];
                    const dy = y - focus[1];
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < radius) {
                        const scale = 1 + strength * (1 - distance / radius);
                        const distortedX = focus[0] + dx * scale;
                        const distortedY = focus[1] + dy * scale;
                        baseStream.point(distortedX, distortedY);
                    } else {
                        baseStream.point(x, y);
                    }
                },
                sphere: baseStream.sphere,
                lineStart: baseStream.lineStart,
                lineEnd: baseStream.lineEnd,
                polygonStart: baseStream.polygonStart,
                polygonEnd: baseStream.polygonEnd,
            };
        },
    };
}
function fisheyeDistortion(x, y, focusX, focusY, strength, radius) {
    const dx = x - focusX;
    const dy = y - focusY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < radius) {
        const distortion = (1 - distance / radius) * strength;
        return [
            focusX + dx * (1 + distortion),
            focusY + dy * (1 + distortion),
        ];
    }
    return [x, y];
}
function convertIso3ToIso2(iso3) {
    return iso3ToIso2[iso3] || null;  // Returns null if the ISO3 code is not in the mapping
}
