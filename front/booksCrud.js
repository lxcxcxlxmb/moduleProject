const ENDPOINT = "http://localhost:3000";

const loadTable = () => {
    axios.get(`${ENDPOINT}/books`)
        .then((response) => {
            if (response.status === 200) {
                const data = response.data;
                var trHTML = '';
                data.forEach(element => {
                    trHTML += '<tr>';
                    trHTML += '<td>' + element.id + '</td>';
                    trHTML += '<td>' + element.title + '</td>';
                    trHTML += '<td>' + element.author + '</td>';
                    trHTML += '<td>' + element.publication_year + '</td>';
                    trHTML += '<td>' + element.pages + '</td>';
                    trHTML += '<td>' + element.value + '</td>';
                    trHTML += '<td>' + element.Category.description + '</td>';
                    trHTML += '<td>' + element.Publisher.name + '</td>';
                    trHTML += '<td>' + element.Format.description + '</td>';
                    trHTML += '<td><button type="button" class="btn btn-outline-secondary" onclick="showBookEditBox(' + element.id + ')">Edit</button>';
                    trHTML += '<button type="button" class="btn btn-outline-danger" onclick="bookDelete(' + element.id + ')">Del</button></td>';
                    trHTML += "</tr>";
                });
                document.getElementById("mytable").innerHTML = trHTML;
            }
        })
};

loadTable();

const filter = () => {
    axios.get(`${ENDPOINT}/books?title=` + document.getElementById("fltrTitle").value)
        .then((response) => {
            if (response.status === 200) {
                const data = response.data;
                var trHTML = '';
                data.forEach(element => {
                    trHTML += '<tr>';
                    trHTML += '<td>' + element.id + '</td>';
                    trHTML += '<td>' + element.title + '</td>';
                    trHTML += '<td>' + element.author + '</td>';
                    trHTML += '<td>' + element.publication_year + '</td>';
                    trHTML += '<td>' + element.pages + '</td>';
                    trHTML += '<td>' + element.value + '</td>';
                    trHTML += '<td>' + element.Category.description + '</td>';
                    trHTML += '<td>' + element.Publisher.name + '</td>';
                    trHTML += '<td>' + element.Format.description + '</td>';
                    trHTML += '<td><button type="button" class="btn btn-outline-secondary" onclick="showBookEditBox(' + element.id + ')">Edit</button>';
                    trHTML += '<button type="button" class="btn btn-outline-danger" onclick="bookDelete(' + element.id + ')">Del</button></td>';
                    trHTML += "</tr>";
                });
                document.getElementById("mytable").innerHTML = trHTML;
            }
        })
};

const bookCreate = () => {
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const publication_year = document.getElementById("publication_year").value;
    const pages = document.getElementById("pages").value;
    const value = document.getElementById("value").value;
    const CategoryId = document.getElementById("CategoryId").value;
    const PublisherId = document.getElementById("PublisherId").value;
    const FormatId = document.getElementById("FormatId").value;

    axios.post(`${ENDPOINT}/books`, {
        title: title,
        author: author,
        publication_year: publication_year,
        pages: pages,
        value: value,
        CategoryId: CategoryId,
        PublisherId: PublisherId,
        FormatId: FormatId,
    })
        .then((response) => {
            Swal.fire(`Book ${response.data.title} created`);
            loadTable();
        }, (error) => {
            Swal.fire(`Error to create book: ${error.response.data.error} `)
                .then(() => {
                    showBookCreateBox();
                })
        });
}

const getBook = (id) => {
    return axios.get(`${ENDPOINT}/books/` + id);
}

const bookEdit = () => {
    const id = document.getElementById("id").value;
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const publication_year = document.getElementById("publication_year").value;
    const pages = document.getElementById("pages").value;
    const value = document.getElementById("value").value;
    const CategoryId = document.getElementById("CategoryId").value;
    const PublisherId = document.getElementById("PublisherId").value;
    const FormatId = document.getElementById("FormatId").value;

    axios.put(`${ENDPOINT}/books/` + id, {
        title: title,
        author: author,
        publication_year: publication_year,
        pages: pages,
        value: value,
        CategoryId: CategoryId,
        PublisherId: PublisherId,
        FormatId: FormatId,
    })
        .then((response) => {
            Swal.fire(`Book ${response.data.title} updated`);
            loadTable();
        }, (error) => {
            Swal.fire(`Error to update book: ${error.response.data.error} `)
                .then(() => {
                    showBookCreateBox(id);
                })
        });
}

const bookDelete = async (id) => {
    const book = await getBook(id);
    const data = book.data;
    axios.delete(`${ENDPOINT}/books/` + id)
        .then((response) => {
            Swal.fire(`Book ${data.title} deleted`);
            loadTable();
        }, (error) => {
            Swal.fire(`Error to delete book: ${error.response.data.error} `);
            loadTable();
        });
};

const getPublishers = () => {
    return axios.get(`${ENDPOINT}/publishers`)
}

const getCategories = () => {
    return axios.get(`${ENDPOINT}/categories`)
}

const getFormats = () => {
    return axios.get(`${ENDPOINT}/formats`)
}

const showBookCreateBox = async () => {
    let publishers = await getPublishers();
    publishers = publishers.data;
    let optionHtmlPub = `<option value="" disabled selected hidden>Publisher</option>`;
    for (const publisher of publishers) {
        optionHtmlPub += `<option value="` + publisher.id + `">` + publisher.name + `</option>`
    }
    let categories = await getCategories();
    categories = categories.data;
    let optionHtmlCat = `<option value="" disabled selected hidden>Category</option>`;
    for (const category of categories) {
        optionHtmlCat += `<option value="` + category.id + `">` + category.description + `</option>`
    }
    let formats = await getFormats();
    formats = formats.data;
    let optionHtmlFor = `<option value="" disabled selected hidden>Format</option>`;
    for (const format of formats) {
        optionHtmlFor += `<option value="` + format.id + `">` + format.description + `</option>`
    }
    Swal.fire({
        title: 'Create book',
        html:
            '<input id="id" type="hidden">' +
            '<input id="title" class="swal2-input" placeholder="Title">' +
            '<input id="author" class="swal2-input" placeholder="Author">' +
            '<input id="publication_year" class="swal2-input" placeholder="Publication year">' +
            '<input id="pages" class="swal2-input" placeholder="Pages">' +
            '<input id="value" class="swal2-input" placeholder="Value">' +
            '<select id="CategoryId" class="swal2-input" name="Category">' +
            optionHtmlCat +
            '</select><br>' +
            '<select id="PublisherId" class="swal2-input" name="Publisher">' +
            optionHtmlPub +
            '</select><br>' +
            '<select id="FormatId" class="swal2-input" name="Format">' +
            optionHtmlFor +
            '</select>',
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
            bookCreate();
        }
    });
}

const showBookEditBox = async (id) => {
    let publishers = await getPublishers();
    publishers = publishers.data;
    let optionHtmlPub = `<option value="" disabled selected hidden>Publisher</option>`;
    for (const publisher of publishers) {
        optionHtmlPub += `<option value="` + publisher.id + `">` + publisher.name + `</option>`
    }
    let categories = await getCategories();
    categories = categories.data;
    let optionHtmlCat = `<option value="" disabled selected hidden>Category</option>`;
    for (const category of categories) {
        optionHtmlCat += `<option value="` + category.id + `">` + category.description + `</option>`
    }
    let formats = await getFormats();
    formats = formats.data;
    let optionHtmlFor = `<option value="" disabled selected hidden>Format</option>`;
    for (const format of formats) {
        optionHtmlFor += `<option value="` + format.id + `">` + format.description + `</option>`
    }
    const book = await getBook(id);
    const data = book.data;
    Swal.fire({
        title: 'Edit Book',
        html:
            '<input id="id" type="hidden" value=' + data.id + '>' +
            '<input id="title" class="swal2-input" placeholder="Title" value="' + data.title + '">' +
            '<input id="author" class="swal2-input" placeholder="Author" value="' + data.author + '">' +
            '<input id="publication_year" class="swal2-input" placeholder="Publication year" value="' + data.publication_year + '">' +
            '<input id="pages" class="swal2-input" placeholder="Pages" value="' + data.pages + '">' +
            '<input id="value" class="swal2-input" placeholder="Value" value="' + data.value + '">' +
            '<select id="CategoryId" class="swal2-input" name="Category">' +
            optionHtmlCat +
            '</select><br>' +
            '<select id="PublisherId" class="swal2-input" name="Publisher">' +
            optionHtmlPub +
            '</select><br>' +
            '<select id="FormatId" class="swal2-input" name="Format">' +
            optionHtmlFor +
            '</select>',
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
            bookEdit();
        }
    });

}
