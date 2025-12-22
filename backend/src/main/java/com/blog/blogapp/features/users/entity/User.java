package com.blog.blogapp.features.users.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(unique = true)
  private String email;

  private String name;
  private String password;

  @Enumerated(EnumType.STRING)
  private Role role;

  // 👉 NEW FIELD
  @Column(nullable = false)
  private boolean banned = false;
  
//somewhere with other fields
@Column(nullable = true, length = 160)
private String bio;

@Column(nullable = true, length = 80)
private String location;

@Column(nullable = true, length = 200)
private String website;


  public User() {}

  public User(String name, String email, String password, Role role){
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
  }

  // getters/setters...

  public Long getId(){ return id; }
  public void setId(Long id){ this.id = id; }

  public String getEmail(){ return email; }
  public void setEmail(String email){ this.email = email; }

  public String getName(){ return name; }
  public void setName(String name){ this.name = name; }

  public String getPassword(){ return password; }
  public void setPassword(String password){ this.password = password; }

  public Role getRole(){ return role; }
  public void setRole(Role role){ this.role = role; }

  // 👉 NEW GETTER / SETTER
  public boolean isBanned() { return banned; }
  public void setBanned(boolean banned) { this.banned = banned; }
  
  public String getBio() {
	    return bio;
	}

	public void setBio(String bio) {
	    this.bio = bio;
	}

	public String getLocation() {
	    return location;
	}

	public void setLocation(String location) {
	    this.location = location;
	}

	public String getWebsite() {
	    return website;
	}

	public void setWebsite(String website) {
	    this.website = website;
	}

}
