const ENDPOINT = "http://localhost:3003";

const loadTable = () => {
    axios.get(`${ENDPOINT}/publishers`)
        .then((response) => {
            if (response.status === 200) {
                const data = response.data;
                var trHTML = '';
                data.forEach(element => {
                    trHTML += '<tr>';
                    trHTML += '<td>' + element.id + '</td>';
                    trHTML += '<td>' + element.name + '</td>';
                    trHTML += '<td>' + element.City.name + '</td>';
                    trHTML += '<td><button type="button" class="btn btn-outline-secondary" onclick="showPublisherEditBox(' + element.id + ')">Edit</button>';
                    trHTML += '<button type="button" class="btn btn-outline-danger" onclick="publisherDelete(' + element.id + ')">Del</button></td>';
                    trHTML += "</tr>";
                });
                document.getElementById("mytable").innerHTML = trHTML;
            }
        })
};

loadTable();

const publisherCreate = () => {
    const name = document.getElementById("name").value;
    const CityId = document.getElementById("CityId").value;

    axios.post(`${ENDPOINT}/publishers`, {
        name: name,
        CityId: CityId,
    })
        .then((response) => {
            Swal.fire(`Publisher ${response.data.name} created`);
            loadTable();
        }, (error) => {
            Swal.fire(`Error to create publisher: ${error.response.data.error} `)
                .then(() => {
                    showPublisherCreateBox();
                })
        });
}

const getPublisher = (id) => {
    return axios.get(`${ENDPOINT}/publishers/` + id);
}

const publisherEdit = () => {
    const name = document.getElementById("name").value;
    const CityId = document.getElementById("CityId").value;

    axios.put(`${ENDPOINT}/publishers/` + id, {
        name: name,
        CityId: CityId,
    })
        .then((response) => {
            Swal.fire(`Publisher ${response.data.name} updated`);
            loadTable();
        }, (error) => {
            Swal.fire(`Error to update publisher: ${error.response.data.error} `)
                .then(() => {
                    showPublisherCreateBox(id);
                })
        });
}

const publisherDelete = async (id) => {
    const publisher = await getPublisher(id);
    const data = publisher.data;
    axios.delete(`${ENDPOINT}/publishers/` + id)
        .then((response) => {
            Swal.fire(`Publisher ${data.name} deleted`);
            loadTable();
        }, (error) => {
            Swal.fire(`Error to delete publisher: ${error.response.data.error} `);
            loadTable();
        });
};

const getCities = () => {
    return axios.get(`${ENDPOINT}/cities`)
}

const showPublisherCreateBox = async () => {
    let cities = await getCities();
    cities = cities.data;
    let optionHtml = '';
    for (const city of cities) {
        optionHtml += `<option value="` + city.id + `">` + city.name + `</option>`
    }
    Swal.fire({
        title: 'Create publisher',
        html:
            '<input id="id" type="hidden">' +
            '<input id="name" class="swal2-input" placeholder="Name">' +
            '<select id="CityId" class="swal2-input" name="City">' +
            optionHtml +
            '</select>',
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
            publisherCreate();
        }
    });
}

const showPublisherEditBox = async (id) => {
    let cities = await getCities();
    cities = cities.data;
    let optionHtml = '';
    for (const city of cities) {
        optionHtml += `<option value="` + city.id + `">` + city.name + `</option>`
    }
    const publisher = await getPublisher(id);
    const data = publisher.data;
    Swal.fire({
        title: 'Edit Publisher',
        html:
            '<input id="id" type="hidden" value=' + data.id + '>' +
            '<input id="name" class="swal2-input" placeholder="Name" value="' + data.name + '">' +
            '<select id="CityId" class="swal2-input" name="City">' +
            optionHtml +
            '</select>',
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
            publisherEdit();
        }
    });

}
