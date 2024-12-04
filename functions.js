function drawGlobe(geojson, year,selectedCountries) {
    // Filter data for the current year

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
            vaccinated: +d['%vaccinated']
        };
    });
    console.log("Country Data Lookup:", countryData);
    const lifeExpScale = d3.scaleSequential(d3.interpolateRgb.gamma(2.2)("purple", "orange")) // A color scale for life expectancy


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
        const brightnessFactor = (lifeExp - 20) / (90 - 20);  // Normalize life expectancy to 0-1 scale
        const adjustedColor = adjustBrightness(color, 1 + brightnessFactor);  // Apply brightness adjustment

        return color;  // Return the adjusted color
    })          
        .attr("stroke", "#fff")
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

    console.log("selectedCountries", selectedCountries);
    // Add bar charts for %gdpa and %vaccinated on top of each country
    svg.append("g").selectAll(".bar-chart")
    .data(geojson.features.filter(d => selectedCountries.length==0 || selectedCountries.includes(d.id)))
    .enter().append("g")
        .attr("class", "bar-chart")
        .attr("transform", d => {
            const centroid = path.centroid(d);
            return `translate(${centroid[0]}, ${centroid[1] - 5})`; // Adjust position slightly above the country
        })
        .each(function(d) {
            const countryCode = d.id;
            console.log("Country Code:", countryCode, "GDP:", countryData[countryCode]?.gdpa|| 0, "Vaccinated:", countryData[countryCode]?.vaccinated|| 0);
            const gdpa = countryData[countryCode]?.gdpa || 0;
            const vaccinated = countryData[countryCode]?.vaccinated || 0;
            const gdpaHeight = Math.max(0, gdpaScale(gdpa));  // Ensure non-negative height
            const vaccinatedHeight = Math.max(0, vaccinationScale(vaccinated));
            // Draw the GDP bar
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
});
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
            const centroid = path.centroid(d); // Get the updated centroid for the country
            return `translate(${centroid[0]}, ${centroid[1] - 5})`; // Reapply the position
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

// Function to add a heatmap legend for life expectancy
function addLegend() {
    const legendHeight = 200, legendWidth = 10;

    const legendSvg = svg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${width - 50}, 100)`);

    const legendScale = d3.scaleLinear()
        .range([legendHeight, 0])
        .domain(colorScale.domain());

    const legendAxis = d3.axisRight(legendScale)
        .tickFormat(d3.format(".0f"))
        .ticks(6);

    legendSvg.selectAll("rect")
        .data(d3.range(legendHeight), d => d)
        .enter().append("rect")
        .attr("x", 0)
        .attr("y", d => legendHeight - d)
        .attr("width", legendWidth)
        .attr("height", 1)
        .attr("fill", d => colorScale(legendScale.invert(d)));

    legendSvg.append("g")
        .attr("transform", `translate(${legendWidth}, 0)`)
        .call(legendAxis);
}


// Function to enable dragging interaction for the globe
function enableDragging() {
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
            const centroid = path.centroid(d);
            return `translate(${centroid[0]}, ${centroid[1] - 5})`;
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