const ENDPOINT = "http://localhost:3000";

const getState = (id) => {
    return axios.get(`${ENDPOINT}/states/` + id);
}

const loadTable = () => {
    axios.get(`${ENDPOINT}/cities`)
        .then((response) => {
            if (response.status === 200) {
                const data = response.data;
                var trHTML = '';
                data.forEach(element => {
                    trHTML += '<tr>';
                    trHTML += '<td>' + element.id + '</td>';
                    trHTML += '<td>' + element.name + '</td>';
                    trHTML += '<td>' + element.cep + '</td>';
                    trHTML += '<td>' + element.State.name + '</td>';
                    trHTML += '<td><button type="button" class="btn btn-outline-secondary" onclick="showCityEditBox(' + element.id + ')">Edit</button>';
                    trHTML += '<button type="button" class="btn btn-outline-danger" onclick="cityDelete(' + element.id + ')">Del</button></td>';
                    trHTML += "</tr>";
                });
                document.getElementById("mytable").innerHTML = trHTML;
            }
        })
};

loadTable();

const cityCreate = () => {
    const name = document.getElementById("name").value;
    const cep = document.getElementById("cep").value;
    const StateId = document.getElementById("StateId").value;

    axios.post(`${ENDPOINT}/cities`, {
        name: name,
        cep: cep,
        StateId: StateId,
    })
        .then((response) => {
            Swal.fire(`City of ${response.data.name} created`);
            loadTable();
        }, (error) => {
            Swal.fire(`Error to create city: ${error.response.data.error} `)
                .then(() => {
                    showCityCreateBox();
                })
        });
}

const getCity = (id) => {
    return axios.get(`${ENDPOINT}/cities/` + id);
}

const cityEdit = () => {
    const id = document.getElementById("id").value;
    const name = document.getElementById("name").value;
    const cep = document.getElementById("cep").value;
    const StateId = document.getElementById("StateId").value;

    axios.put(`${ENDPOINT}/cities/` + id, {
        name: name,
        cep: cep,
        StateId: StateId,
    })
        .then((response) => {
            Swal.fire(`City of ${response.data.name} updated`);
            loadTable();
        }, (error) => {
            Swal.fire(`Error to update city: ${error.response.data.error} `)
                .then(() => {
                    showCityCreateBox(id);
                })
        });
}

const cityDelete = async (id) => {
    const city = await getCity(id);
    const data = city.data;
    axios.delete(`${ENDPOINT}/cities/` + id)
        .then((response) => {
            Swal.fire(`City of ${data.name} deleted`);
            loadTable();
        }, (error) => {
            Swal.fire(`Error to delete city: ${error.response.data.error} `);
            loadTable();
        });
};

const getStates = () => {
    return axios.get(`${ENDPOINT}/states`)
}

const showCityCreateBox = async () => {
    let states = await getStates();
    states = states.data;
    let optionHtml = `<option value="" disabled selected hidden>State</option>`;
    for (const state of states) {
        optionHtml += `<option value="` + state.id + `">` + state.province + `</option>`
    }
    Swal.fire({
        title: 'Create city',
        html:
            '<input id="id" type="hidden">' +
            '<input id="name" class="swal2-input" placeholder="Name">' +
            '<input id="cep" class="swal2-input" placeholder="CEP">' +
            '<select id="StateId" class="swal2-input" name="State">' +
            optionHtml +
            '</select>',
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
            cityCreate();
        }
    });
}

const showCityEditBox = async (id) => {
    let states = await getStates();
    states = states.data;
    let optionHtml = `<option value="" disabled selected hidden>State</option>`;
    for (const state of states) {
        optionHtml += `<option value="` + state.id + `">` + state.province + `</option>`
    }
    const city = await getCity(id);
    const data = city.data;
    Swal.fire({
        title: 'Edit City',
        html:
            '<input id="id" type="hidden" value=' + data.id + '>' +
            '<input id="name" class="swal2-input" placeholder="Name" value="' + data.name + '">' +
            '<input id="cep" class="swal2-input" placeholder="cep" value="' + data.cep + '">' +
            '<select id="StateId" class="swal2-input" name="State">' +
            optionHtml +
            '</select>',
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
            cityEdit();
        }
    });

}
