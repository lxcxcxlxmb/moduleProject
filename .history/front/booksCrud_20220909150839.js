const ENDPOINT = "http://localhost:3003";

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
                    trHTML += '<td>' + element.Category.description + '</td>';
                    trHTML += '<td>' + element.Publisher.name + '</td>';
                    trHTML += '<td><button type="button" class="btn btn-outline-secondary" onclick="showBookEditBox(' + element.id + ')">Edit</button>';
                    trHTML += '<button type="button" class="btn btn-outline-danger" onclick="bookDelete(' + element.id + ')">Del</button></td>';
                    trHTML += "</tr>";
                });
                document.getElementById("mytable").innerHTML = trHTML;
            }
        })
};

loadTable();

const bookCreate = () => {
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const publication_year = document.getElementById("publication_year").value;
    const pages = document.getElementById("pages").value;
    const CategoryId = document.getElementById("CategoryId").value;
    const PublisherId = document.getElementById("PublisherId").value;

    axios.post(`${ENDPOINT}/books`, {
        title: title,
        author: author,
        publication_year: publication_year,
        pages: pages,
        CategoryId: CategoryId,
        PublisherId: PublisherId,
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
    const CategoryId = document.getElementById("CategoryId").value;
    const PublisherId = document.getElementById("PublisherId").value;

    axios.put(`${ENDPOINT}/books/` + id, {
        title: title,
        author: author,
        publication_year: publication_year,
        pages: pages,
        CategoryId: CategoryId,
        PublisherId: PublisherId,
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

const showBookCreateBox = async () => {
    let publishers = await getPublishers();
    publishers = publishers.data;
    let optionHtmlPub = '';
    for (const publisher of publishers) {
        optionHtmlPub += `<option value="` + publisher.id + `">` + publisher.name + `</option>`
    }
    let categories = await getCategories();
    categories = categories.data;
    let optionHtmlCat = '';
    for (const category of categories) {
        optionHtmlCat += `<option value="` + category.id + `">` + category.description + `</option>`
    }
    Swal.fire({
        title: 'Create book',
        html:
            '<input id="id" type="hidden">' +
            '<input id="title" class="swal2-input" placeholder="Title">' +
            '<input id="author" class="swal2-input" placeholder="Author">' +
            '<input id="publication_year" class="swal2-input" placeholder="Publication year">' +
            '<input id="pages" class="swal2-input" placeholder="Pages">' +
            '<select id="CategoryId" class="swal2-input" name="Category">' +
            optionHtmlCat +
            '</select>' +
            '<select id="PublisherId" class="swal2-input" name="Publisher">' +
            optionHtmlPub +
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
    let optionHtmlPub = '';
    for (const publisher of publishers) {
        optionHtmlPub += `<option value="` + publisher.id + `">` + publisher.name + `</option>`
    }
    let categories = await getCategories();
    categories = categories.data;
    let optionHtmlCat = '';
    for (const category of categories) {
        optionHtmlCat += `<option value="` + category.id + `">` + category.description + `</option>`
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
            '<select id="CategoryId" class="swal2-input" name="Category">' +
            optionHtmlCat +
            '</select>' +
            '<select id="PublisherId" class="swal2-input" name="Publisher">' +
            optionHtmlPub +
            '</select>',
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
            bookEdit();
        }
    });

}
