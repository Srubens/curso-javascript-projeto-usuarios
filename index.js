(function(){
	"use script";

	let field = document.querySelectorAll("#form-user-create [name]");
	let user = {};

	function addLine(dataUser){
		let tr = document.createElement("tr");
		tr.innerHTML = `
                    <td><img src="dist/img/user1-128x128.jpg" alt="User Image" class="img-circle img-sm"></td>
                    <td>${dataUser.name}</td>
                    <td>${dataUser.email}</td>
                    <td>${dataUser.admin}</td>
                    <td>${dataUser.birth}</td>
                    <td>
                      <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
                      <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                    </td>`;

        document.getElementById("table-users").appendChild(tr);
		console.log('addline', dataUser);
	}
	
	// console.log(user);

	document.getElementById("form-user-create").addEventListener("submit", function(event){
		
		event.preventDefault();//CANELA O COMPORTAMENTO PADRAO

		field.forEach(function (field, index) {
			if (field.name == "gender") {
				if (field.checked) {
					user[field.name] = field.value;
				}
			} else {
				user[field.name] = field.value;
			}

		});

		addLine(user);
		// console.log(user);

	});

	console.log("RUBENS FILIPE | SRUBENS");
})();