class UserController {

	constructor(formId, tableId){
		this.formEl = document.getElementById(formId);
		this.tableEl = document.getElementById(tableId);
		this.onSubmit();
	}

	//SUBMETENDO AO FORMULARIO
	onSubmit(){

		this.formEl.addEventListener("submit", event => {
		
			event.preventDefault();//CANELA O COMPORTAMENTO PADRAO

			let values = this.getValues();

			this.getPhoto()
			.then((content)=>{

				values.photo = content;

				this.addLine(values);

			}, (e)=>{
				console.error(value);
			});

		});
	}

	//PEGA AS FOTOS
	getPhoto(){

		return new Promise((resolve,reject)=>{

			let fileReader = new FileReader();

			let elements = [...this.formEl.elements].filter( item =>{

				if(item.name === 'photo'){
					return item;
				} 

			} );

			// console.log(elements[0].files[0]);

			let file = elements[0].files[0];

			//EM CASO DE SUCESSO
			fileReader.onload = () =>{
				resolve(fileReader.result);
			};

			// EM CASO DE ERRO
			fileReader.onerror = (e) =>{
				reject(e);
			}

			fileReader.readAsDataURL(file);

		});

	}

	//PEGAR O VALOR E RETORNAR UM JSON
	getValues(){

		let user = {};

		[...this.formEl.elements].forEach(function (field, index) {
			if (field.name == "gender") {
				if (field.checked) {
					user[field.name] = field.value;
				}
			} else {
				user[field.name] = field.value;
			}

		});

		return new User(user.name,user.gender,user.birth,user.country,user.email,user.password,user.photo,user.admin, user.data);

	}

	addLine(dataUser){
		//CRIA UM ELEMENTO TR
		let tr = document.createElement("tr");
		tr.innerHTML = `
                    <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
                    <td>${dataUser.name}</td>
                    <td>${dataUser.email}</td>
                    <td>${dataUser.admin}</td>
                    <td>${dataUser.data}</td>
                    <td>
                      <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
                      <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                    </td>`;

        this.tableEl.appendChild(tr);

	}

}