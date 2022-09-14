const ENDPOINT = "http://localhost:3000";

const loadTable = () => {
    axios.get(`${ENDPOINT}/formats`)
        .then((response) => {
            if (response.status === 200) {
                const data = response.data;
                var trHTML = '';
                data.forEach(element => {
                    trHTML += '<tr>';
                    trHTML += '<td>' + element.id + '</td>';
                    trHTML += '<td>' + element.description + '</td>';
                    trHTML += '<td><button type="button" class="btn btn-outline-secondary" onclick="showFormatEditBox(' + element.id + ')">Edit</button>';
                    trHTML += '<button type="button" class="btn btn-outline-danger" onclick="formatDelete(' + element.id + ')">Del</button></td>';
                    trHTML += "</tr>";
                });
                document.getElementById("mytable").innerHTML = trHTML;
            }
        })
};

loadTable();

const formatCreate = () => {
    const description = document.getElementById("description").value;

    axios.post(`${ENDPOINT}/formats`, {
        description: description,
    })
        .then((response) => {
            Swal.fire(`${response.data.description} format created`);
            loadTable();
        }, (error) => {
            Swal.fire(`Error to create format: ${error.response.data.error} `)
                .then(() => {
                    showFormatCreateBox();
                })
        });
}

const getFormat = (id) => {
    return axios.get(`${ENDPOINT}/formats/` + id);
}

const formatEdit = () => {
    const id = document.getElementById("id").value;
    const description = document.getElementById("description").value;

    axios.put(`${ENDPOINT}/formats/` + id, {
        description: description,
    })
        .then((response) => {
            Swal.fire(`${response.data.description} format updated`);
            loadTable();
        }, (error) => {
            Swal.fire(`Error to update format: ${error.response.data.error} `)
                .then(() => {
                    showFormatCreateBox(id);
                })
        });
}

const formatDelete = async (id) => {
    const format = await getFormat(id);
    const data = format.data;
    axios.delete(`${ENDPOINT}/formats/` + id)
        .then((response) => {
            Swal.fire(`${data.description} format deleted`);
            loadTable();
        }, (error) => {
            Swal.fire(`Error to delete format: ${error.response.data.error} `);
            loadTable();
        });
};

const showFormatCreateBox = () => {
    Swal.fire({
        title: 'Create format',
        html:
            '<input id="id" type="hidden">' +
            '<input id="description" class="swal2-input" placeholder="Description">',
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
            formatCreate();
        }
    });
}

const showFormatEditBox = async (id) => {
    const format = await getFormat(id);
    const data = format.data;
    Swal.fire({
        title: 'Edit Format',
        html:
            '<input id="id" type="hidden" value=' + data.id + '>' +
            '<input id="description" class="swal2-input" placeholder="Description" value="' + data.description + '">',
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
            formatEdit();
        }
    });

}
