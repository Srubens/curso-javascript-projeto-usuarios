class UserController {

	constructor(formIdCreate,formIdUpdate, tableId){
		this.formEl = document.getElementById(formIdCreate);
		this.formUpdateEl = document.getElementById(formIdUpdate);
		this.tableEl = document.getElementById(tableId);
		this.onSubmit();
		this.onEdit();
	}

	//EVENTOS DE EDICAO
	onEdit(){
		//CANCELA A EDICAO 
		document.querySelector("#box-user-update .btn-cancel").addEventListener("click", e=>{
			e.preventDefault();
			this.showPainelCreate();
		});

		this.formUpdateEl.addEventListener("submit", event =>{
			
			event.preventDefault();//CANELA O COMPORTAMENTO PADRAO
		
			let btn = this.formUpdateEl.querySelector("[type=submit]");//PARA O BOTAO DE ENVIO
		
			btn.disable = true;

			let values = this.getValues(this.formUpdateEl);

			// console.log(values);

			let index = this.formUpdateEl.dataset.trIndex;

			let tr = this.tableEl.rows[index];

			//OBJETO ANTIGO PARA ALTERAR FOTO
			let userOld = JSON.parse(tr.dataset.user);

			//CRIANDO UM NOVO OBJ INCREMENTANDO OS VALORES DA PRIMEIRA INSTANCIA PARA A SEGUNDA
			let result = Object.assign({}, userOld, values);	        

	        this.getPhoto(this.formUpdateEl)
			.then((content)=>{

				if(!values.photo){
					result._photo = userOld._photo;
				}else{
					result._photo = content;
				}

				tr.dataset.user = JSON.stringify(result);

				tr.innerHTML = `
	            <td><img src="${result._photo}" alt="User Image" class="img-circle img-sm"></td>
	            <td>${result._name}</td>
	            <td>${result._email}</td>
	            <td>${(result._admin) ? 'sim' : 'não'}</td>
	            <td>${Utils.dataFormat(result._register)}</td>
	            <td>
	              <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
	              <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
	            </td>`;

		        this.addEventsTr(tr);

		        this.updateCount();

				this.formUpdateEl.reset();//LIMPA OS CAMPOS

				btn.disable = false;

				this.showPainelCreate();

			}, (e)=>{
				console.error(value);
			});
		
		});

	}

	//SUBMETENDO AO FORMULARIO
	onSubmit(){

		this.formEl.addEventListener("submit", event => {
		
			event.preventDefault();//CANELA O COMPORTAMENTO PADRAO

			let btn = this.formEl.querySelector("[type=submit]");//PARA O BOTAO DE ENVIO

			btn.disable = true;

			let values = this.getValues(this.formEl);

			if(!values) return false;

			this.getPhoto(this.formEl)
			.then((content)=>{

				values.photo = content;

				this.addLine(values);

				this.formEl.reset();//LIMPA OS CAMPOS

				btn.disable = false;

			}, (e)=>{
				console.error(value);
			});

		});
	}

	//PEGA AS FOTOS
	getPhoto(formEl){

		return new Promise((resolve,reject)=>{

			let fileReader = new FileReader();

			let elements = [...formEl.elements].filter( item =>{

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

			//CASO O USARIO NÃO ENVIE FOTO
			if(file){
				fileReader.readAsDataURL(file);
			}else{
				resolve('dist/img/default-50x50.gif');
			}

		});

	}

	//PEGAR O VALOR E RETORNAR UM JSON
	getValues(formEl){

		let user = {};
		let isValid = true;

		[...formEl.elements].forEach(function (field, index) {
			
			if(['name','email','password'].indexOf(field.name) > -1 && !field.value){
				field.parentElement.classList.add(['has-error']);
				isValid = false;
			}

			if (field.name == "gender") {
				if (field.checked) {
					user[field.name] = field.value;
				}
			}else if(field.name === "admin"){
				user[field.name] = field.checked; 
			} else {
				user[field.name] = field.value;
			}

		});

		if(!isValid){
			return false;
		}

		return new User(user.name,user.gender,user.birth,user.country,user.email,user.password,user.photo,user.admin, user.data);

	}

	addLine(dataUser){
		//CRIA UM ELEMENTO TR
		let tr = document.createElement("tr");

		tr.dataset.user = JSON.stringify(dataUser);

		tr.innerHTML = `
                    <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
                    <td>${dataUser.name}</td>
                    <td>${dataUser.email}</td>
                    <td>${(dataUser.admin) ? 'sim' : 'não'}</td>
                    <td>${Utils.dataFormat(dataUser.register)}</td>
                    <td>
                      <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                      <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                    </td>`;

        this.addEventsTr(tr);

        this.tableEl.appendChild(tr);

        this.updateCount();

	}

	addEventsTr(tr){

		// PARTE DA EDICAO
        tr.querySelector(".btn-edit").addEventListener("click", e =>{
        	
        	let json = JSON.parse(tr.dataset.user);

        	this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex;	

        	for(let name in json){
        		let field = this.formUpdateEl.querySelector("[name="+ name.replace("_","") +"]");

        		if(field){
        			if(field.type == 'file') continue;
        			switch(field.type){
        				case 'file':
        					continue;
        				break;
        				case 'radio':
        					field = this.formUpdateEl.querySelector("[name="+ name.replace("_","") +"][value="+ json[name] +"]");
        					field.checked = true;
        				break;
        				case 'checkbox':
        					field.checked = json[name];
        				break;
        				default:
	        				field.value = json[name];
        			}
        			
        		}
        		
        	}

        	this.formUpdateEl.querySelector(".photo").src = json._photo;

        	this.showPainelUpdate();

        });
        // PARTE DA EDICAO

	}

	//MOSTRAR O PAINEL UPDATE
	showPainelUpdate(){
		document.querySelector("#box-user-create").style.display = "none";
    	document.querySelector("#box-user-update").style.display = "block";
	}

	//MOSTRAR O PAINEL CREATE
	showPainelCreate(){
		document.querySelector("#box-user-create").style.display = "block";
    	document.querySelector("#box-user-update").style.display = "none";
	}

	//CALCULA A QUANTIDADE DE USUARIOS
	updateCount(){

		let numberUsers = 0;
		let numberAdmin = 0;

		[...this.tableEl.children].forEach(tr=>{

			numberUsers++;

			// console.log(JSON.parse(tr.dataset.user));
			let user = JSON.parse(tr.dataset.user);

			if(user._admin){ 
				numberAdmin++;
			}

		});

		document.querySelector("#number-users").innerHTML = numberUsers;
		document.querySelector("#number-users-admin").innerHTML = numberAdmin;

	}

}