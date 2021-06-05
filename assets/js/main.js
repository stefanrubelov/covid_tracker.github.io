$(function () {
    let totalConfirmedArr = [];
    let totalRecoveredArr = [];
    let totalDeathsArr = [];
    let chartLabelsArr = [];
    let chartDataConfirmedArr = [];
    let chartDataDeathsArr = [];
    let chartDataRecoveredArr = [];
    var filterTime;

    $("#countries-chart").hide();
    $("#btn-total-previous-day").prop("disabled", true);
    $("head").append(`<link rel="icon" href="assets/images/bacteria.png">`)

    //call to show numbers for the last day available 
    $.get(`http://localhost/Brainster_Projects/Project02_CovidTracker/apiroot/previousday.api.php`, function (data) {
        data.forEach(country => {
            totalConfirmedArr.push(parseInt(country.confirmed_new));
            totalDeathsArr.push(parseInt(country.deaths_new));
            totalRecoveredArr.push(parseInt(country.recovered_new));

            $("#total-confirmed").text(arraySum(totalConfirmedArr));
            $("#total-recovered").text(arraySum(totalRecoveredArr));
            $("#total-deaths").text(arraySum(totalDeathsArr));

            $("#mainTable > tbody").append(`
                <tr>
                    <td><button class="btn btn-link fw-bolder country-click" data-country="${country.country}">${country.country}</button></td>
                    <td>${numWithCommas(country.total_confirmed)}</td>
                    <td>${numWithCommas(country.confirmed_new)}</td>
                    <td>${numWithCommas(country.total_deaths)}</td>
                    <td>${numWithCommas(country.deaths_new)}</td>
                    <td>${numWithCommas(country.total_recovered)}</td>
                    <td>${numWithCommas(country.recovered_new)}</td>
                    <td>${numWithCommas(country.active)}</td>
                </tr>
                `)
        });

        //filter button for total numbers 
        $('.btn[data-time="total"]').on("click", function (e) {
            $(this).prop("disabled", true);
            $('.btn[data-type="total-filter-btn"]').prop("disabled", false);
            totalConfirmedArr = [];
            totalDeathsArr = [];
            totalRecoveredArr = [];

            $("#total-confirmed-footer").text("Total Confirmed");
            $("#total-deaths-footer").text("Total Deaths");
            $("#total-recovered-footer").text("Total Recovered");

            data.forEach(country => {
                totalConfirmedArr.push(parseInt(country.total_confirmed));
                totalDeathsArr.push(parseInt(country.total_deaths));
                totalRecoveredArr.push(parseInt(country.total_recovered));
            })

            $("#total-confirmed").text(arraySum(totalConfirmedArr));
            $("#total-recovered").text(arraySum(totalRecoveredArr));
            $("#total-deaths").text(arraySum(totalDeathsArr));
        })

        //set DataTables to the table
        setTimeout(() => {
            var table = $("#mainTable").DataTable({
                // scrollY: "600px",
                // scrollX: true,
                // scrollCollapse: true,
                paging: false,
                ordering: false,
                info: false
            })

            $('input[type="search"]').attr("placeholder", "Type here to search the table");
            $('input[type="search"]').css({
                backgroundColor: "#fff"
            })

            //create filter buttons on the table
            $("#mainTable_wrapper").append(`
                <div id="table-filter-buttons">
                    <button type="button" onClick="event.preventDefault()" class="btn btn-primary mr-3 px-2 py-1" data-type="table-filter-btn" data-time="previousday" id="btn-table-previous-day" disabled>Last Day</button>
                    <button type="button" onClick="event.preventDefault()" class="btn btn-primary mx-3 px-2 py-1" data-type="table-filter-btn" data-time="previousmonth" id="btn-table-previous-month">Last Month</button>
                    <button type="button" onClick="event.preventDefault()" class="btn btn-primary mx-3 px-2 py-1" data-type="table-filter-btn" data-time="previousquarter" id="btn-table-previous-quarter">Last Quarter</button>
                </div>`)
            $("#table-filter-buttons").css({
                position: "absolute",
                top: 0,
                left: 0,
                // width: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            })
        }, 1200);
        hideLoadingScreen();

    }, "json")
        .fail(function () {
            alert("An error occured, please try again later");
        })

    //table filter buttons (last day, last month, last quarter(3months))
    $(document).on("click", '.btn[data-type="table-filter-btn"]', function (e) {
        e.preventDefault();
        $("#mainTable > tbody").html("");

        filterTime = $(this).data("time");
        let buttonText = $(this).text();

        $("#new-confirmed-column").text("Confirmed " + buttonText);
        $("#new-deaths-column").text("Deaths " + buttonText);
        $("#new-recovered-column").text("Recovered " + buttonText);

        $(this).prop("disabled", true);
        $('.btn[data-type="table-filter-btn"]').not(this).prop("disabled", false);

        $.get(`http://localhost/Brainster_Projects/Project02_CovidTracker/apiroot/${filterTime}.api.php`, function (data) {
            data.forEach(country => {
                $("#mainTable > tbody").append(`
                    <tr>
                    <td><button class="btn btn-link fw-bolder country-click" data-country="${country.country}">${country.country}</button></td>
                    <td>${numWithCommas(country.total_confirmed)}</td>
                    <td>${numWithCommas(country.confirmed_new)}</td>
                    <td>${numWithCommas(country.total_deaths)}</td>
                    <td>${numWithCommas(country.deaths_new)}</td>
                    <td>${numWithCommas(country.total_recovered)}</td>
                    <td>${numWithCommas(country.recovered_new)}</td >
                    <td>${numWithCommas(country.active)}</td>
                    </tr >
                    `)
            });

        }, "json")
            .fail(function () {
                alert("An error occured, please try again later");
            })
    })

    //total numbers filter button
    $(document).on("click", '.btn[data-type="total-filter-btn"]', function (e) {
        totalConfirmedArr = [];
        totalRecoveredArr = [];
        totalDeathsArr = [];

        let buttonText = $(this).text();
        buttonText = $.trim(buttonText);
        let buttonDaysNum = $(this).data("time-num");

        $("#total-confirmed-footer").text("Confirmed " + buttonText);
        $("#total-deaths-footer").text("Deaths " + buttonText);
        $("#total-recovered-footer").text("Recovered " + buttonText);

        filterTime = $(this).data("time");
        $(this).prop("disabled", true);

        $('.btn[data-time="total"]').prop("disabled", false);
        $('.btn[data-type="total-filter-btn"]').not(this).prop("disabled", false);
        $.get(`http://localhost/Brainster_Projects/Project02_CovidTracker/apiroot/${filterTime}.api.php`, function (data) {
            data.forEach(country => {
                totalConfirmedArr.push(parseInt(country.confirmed_new));
                totalRecoveredArr.push(parseInt(country.recovered_new));
                totalDeathsArr.push(parseInt(country.deaths_new));
            });

            $("#total-confirmed").text(arraySum(totalConfirmedArr));
            $("#total-recovered").text(arraySum(totalRecoveredArr));
            $("#total-deaths").text(arraySum(totalDeathsArr));

        }, "json")
            .fail(function () {
                alert("An error occured, please try again later");
            })

        //chart for total numbers
        $.get(`http://localhost/Brainster_Projects/Project02_CovidTracker/apiroot/totalchart.api.php`, function (data) {
            data.forEach(date => {
                chartLabelsArr.push(date.date);
                chartDataConfirmedArr.push(parseInt(date.total_confirmed))
                chartDataDeathsArr.push(parseInt(date.total_deaths))
                chartDataRecoveredArr.push(parseInt(date.total_recovered))
            });

            myChart.destroy();
            appendBarChart(chartLabelsArr.slice(buttonDaysNum), chartDataConfirmedArr.slice(buttonDaysNum), chartDataDeathsArr.slice(buttonDaysNum), chartDataRecoveredArr.slice(buttonDaysNum));

        }, "json")
            .fail(function () {
                alert("An error occured, please try again later");
            })
    })

    //specific country info when you click on the country name(populate table and create new chart)
    $(document).on("click", ".country-click", function (e) {
        setTimeout(() => {
            location.hash = "#casesTableHeading";
        }, 300);

        chartLabelsArr = [];
        chartDataConfirmedArr = [];
        chartDataDeathsArr = [];
        chartDataRecoveredArr = [];

        let countryName = $(this).data("country");

        $("#countries-chart").show();
        $("#unique-country-name").text("");
        $("#mainTable > tbody").html("");
        $("#country-column").hide();
        $("#table-filter-buttons").hide();
        $("#unique-country-name").show();
        $("#show-all-countries-btn").remove();

        $("#confirmed-column").text("Confirmed");
        $("#new-confirmed-column").text("Confirmed Daily");
        $("#deaths-column").text("Deaths");
        $("#new-deaths-column").text("Deaths Daily");
        $("#recovered-column").text("Recovered");
        $("#new-recovered-column").text("Recovered Daily");

        $("#mainTable thead tr").append(`
        <th id="date-column">Date</th>;
        `);
        $("#mainTable_wrapper").append(`
        <button class="btn btn-primary" id="show-all-countries-btn" href="javascript:void(0)">Show all countries</button>
        `);

        // $("#unique-country-name").css({
        //     position: "absolute",
        //     top: 0,
        //     left: 0,
        //     marginLeft: "10px",
        //     fontSize: "1.8rem",
        //     fontWeight: 500,
        //     letterSpacing: "1px"
        // });
        $("#show-all-countries-btn").css({
            position: "absolute",
            top: 0,
            left: 0
        })

        //post method for specific country sql query
        $.post("apiroot/country.api.php",
            {
                country: countryName
            },
            function (data, status) {
                let parsedData = JSON.parse(data)

                $("#unique-country-name").text(`${parsedData[0].country}`);

                parsedData.forEach(country => {
                    $("#mainTable > tbody").append(`
                        <tr>
                        <td>${numWithCommas(country.total_confirmed)}</td>
                        <td>${numWithCommas(country.confirmed_new)}</td>
                        <td>${numWithCommas(country.total_deaths)}</td>
                        <td>${numWithCommas(country.deaths_new)}</td>
                        <td>${numWithCommas(country.total_recovered)}</td>
                        <td>${numWithCommas(country.recovered_new)}</td >
                        <td>${numWithCommas(country.active)}</td>
                        <td>${country.date}</td>
                        </tr >
                        `)

                    chartLabelsArr.push(country.date);
                    chartDataConfirmedArr.push(country.confirmed_new);
                    chartDataDeathsArr.push(country.deaths_new);
                    chartDataRecoveredArr.push(country.recovered_new);

                });
                appendLineChart(chartLabelsArr, chartDataConfirmedArr, chartDataDeathsArr, chartDataRecoveredArr);

            }
        );
    })

    //"back button" from a specific country(from the table and the chart)
    $(document).on("click", "#show-all-countries-btn", function (e) {
        removeHash();
        myChart2.destroy();

        $("#mainTable > tbody").html("");
        $("#countries-chart").hide();
        $("#unique-country-name").hide();
        $("#show-all-countries-btn").hide();
        $("#table-filter-buttons").show();
        $("#country-column").show();
        $("#date-column").remove();

        $("#unique-country-name").text("");
        $("#confirmed-column").text("Confirmed");
        $("#new-confirmed-column").text("Confirmed Last Day");
        $("#deaths-column").text("Deaths");
        $("#new-deaths-column").text("Deaths Last Day");
        $("#recovered-column").text("Recovered");
        $("#new-recovered-column").text("Recovered Last Day");

        $("#btn-total-previous-day").prop("disabled", true);
        $("#btn-total-previous-month").prop("disabled", false);
        $("#btn-total-previous-quarter").prop("disabled", false);

        $.get(`http://localhost/Brainster_Projects/Project02_CovidTracker/apiroot/previousday.api.php`, function (data) {

            data.forEach(country => {
                $("#mainTable > tbody").append(`
                <tr>
                    <td><button class="btn btn-link country-click fw-bolder" data-country="${country.country}">${country.country}</button></td>
                    <td>${numWithCommas(country.total_confirmed)}</td>
                    <td>${numWithCommas(country.confirmed_new)}</td>
                    <td>${numWithCommas(country.total_deaths)}</td>
                    <td>${numWithCommas(country.deaths_new)}</td>
                    <td>${numWithCommas(country.total_recovered)}</td>
                    <td>${numWithCommas(country.recovered_new)}</td>
                    <td>${numWithCommas(country.active)}</td>
                </tr>
                `)
            })

        }, "json")
            .fail(function () {
                alert("An error occured, please try again later");
            })
    })

    // charts for the last available day numbers
    $.get(`http://localhost/Brainster_Projects/Project02_CovidTracker/apiroot/totalchart.api.php`, function (data) {

        data.forEach(date => {
            chartLabelsArr.push(date.date);
            chartDataConfirmedArr.push(parseInt(date.total_confirmed))
            chartDataDeathsArr.push(parseInt(date.total_deaths))
            chartDataRecoveredArr.push(parseInt(date.total_recovered))
        });
        appendBarChart(chartLabelsArr.slice(-1), chartDataConfirmedArr.slice(-1), chartDataDeathsArr.slice(-1), chartDataRecoveredArr.slice(-1));

    }, "json")
        .fail(function () {
            alert("An error occured, please try again later");
        })

    //total numbers filter chart
    $("#btn-total").on("click", function (e) {
        chartLabelsArr = [];
        chartDataConfirmedArr = [];
        chartDataDeathsArr = [];
        chartDataRecoveredArr = [];
        myChart.destroy();

        $.get(`http://localhost/Brainster_Projects/Project02_CovidTracker/apiroot/totalchart.api.php`, function (data) {

            data.forEach(date => {
                chartLabelsArr.push(date.date);
                chartDataConfirmedArr.push(parseInt(date.total_confirmed));
                chartDataDeathsArr.push(parseInt(date.total_deaths));
                chartDataRecoveredArr.push(parseInt(date.total_recovered));
            });
            appendBarChart(chartLabelsArr, chartDataConfirmedArr, chartDataDeathsArr, chartDataRecoveredArr);

        }, "json")
            .fail(function () {
                alert("An error occured, please try again later");
            })
    })
})

let labels;
let data;
let data2;
let config;
let chart;

//bar chart for total numbers
function appendBarChart(labelsArr, confirmedArr, deathsArr, recoveredArr) {
    labels = labelsArr;
    data = {
        labels: labels,
        datasets: [{
            label: 'Confirmed',
            backgroundColor: 'rgb(0, 0, 0)',
            borderColor: 'rgb(0, 0, 0)',
            data: confirmedArr,
        },
        {
            label: 'Deaths',
            backgroundColor: 'rgb(220, 53, 69)',
            borderColor: 'rgb(220, 53, 69)',
            data: deathsArr,
        },
        {
            label: 'Recovered',
            backgroundColor: 'rgb(40,167,69)',
            borderColor: 'rgb(40,167,69)',
            data: recoveredArr,
        },
        ]
    };
    config = {
        type: "bar",
        data,
        options: {
        }
    }
    myChart = new Chart(
        document.getElementById("myChart"),
        config
    );
}

//line chart for countries (a bit different from bar chart)
function appendLineChart(labelsArr, confirmedArr, deathsArr, recoveredArr) {
    labels = labelsArr;
    data = {
        labels: labels,
        datasets: [{
            label: 'Confirmed',
            backgroundColor: 'rgb(0, 0, 0)',
            borderColor: 'rgb(0, 0, 0)',
            data: confirmedArr,
        },
        {
            label: 'Deaths',
            backgroundColor: 'rgb(220, 53, 69)',
            borderColor: 'rgb(220, 53, 69)',
            data: deathsArr,
        },
        {
            label: 'Recovered',
            backgroundColor: 'rgb(40,167,69)',
            borderColor: 'rgb(40,167,69)',
            data: recoveredArr,
        }
        ]
    };
    config = {
        type: "line",
        data,
        options: {
            elements: {
                point: {
                    radius: 1
                },
                line: {
                    tension: 0.2
                }
            }
        }
    }
    myChart2 = new Chart(
        document.getElementById("myChart2"),
        config
    );
}

//calculates sum of numbers in array
function arraySum(array) {
    let sum = array.reduce(function (a, b) {
        return a + b;
    }, 0);
    return numWithCommas(sum);
}

//add commas to bigger numbers, function
function numWithCommas(num) {
    return num.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

var loader = document.getElementById("loadingScreen");
var mainWrapper = document.getElementById("mainWrapper");
function showLoadingScreen() {
    mainWrapper.classList.add("d-none");
    setTimeout(() => {
        loader.classList.remove("d-none");
    }, 1100);
}

//hides the loading screen after the initial ajax call is done + 1 second
function hideLoadingScreen() {
    setTimeout(() => {
        loader.classList.remove("d-flex");
        loader.classList.add("d-none");
        mainWrapper.classList.remove("d-none");
        $("#loader-wrapper").fadeOut();
    }, 1000);
};

//clear hash function
function removeHash() {
    history.pushState("", document.title, window.location.pathname + window.location.search);
}