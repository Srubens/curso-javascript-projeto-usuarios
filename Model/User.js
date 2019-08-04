class User{

	constructor(name,gender,birth,country,email,password,photo,admin,data){
		this.name = name;
		this.gender = gender;
		this.birth = birth;
		this.country = country;
		this.email = email;
		this.password = password;
		this.photo = photo;
		this.admin = admin;
		this.data = new Date();
	}

}