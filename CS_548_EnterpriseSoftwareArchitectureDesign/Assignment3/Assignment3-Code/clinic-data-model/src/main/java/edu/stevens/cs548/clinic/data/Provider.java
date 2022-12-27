package edu.stevens.cs548.clinic.data;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import javax.persistence.*;

import org.eclipse.persistence.annotations.Convert;
import org.eclipse.persistence.annotations.Converter;

/**
 * Entity implementation class for Entity: Provider
 *
 */
@NamedQueries({
		@NamedQuery(name = "SearchProviderByProviderId", query = "select p from Provider p where p.providerId = :providerId"),
		@NamedQuery(name = "CountProviderByProviderId", query = "select count(p) from Provider p where p.providerId = :providerId"),
		@NamedQuery(name = "RemoveAllProviders", query = "delete from Provider p") })
// TODO
@Entity
@Table(name = "Provider", indexes = @Index(columnList="providerId"))
public class Provider implements Serializable {

	private static final long serialVersionUID = -876909316791083094L;

	// TODO JPA annotations
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;

	@Convert("uuidConverter")
	@Column(nullable=false,unique=true)
	private UUID providerId;

	private String npi;

	private String name;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public UUID getProviderId() {
		return providerId;
	}

	public void setProviderId(UUID providerId) {
		this.providerId = providerId;
	}

	public String getNpi() {
		return npi;
	}

	public void setNpi(String npi) {
		this.npi = npi;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	// TODO JPA annotations (propagate deletion of provider to treatments)
	@OneToMany(targetEntity = Treatment.class)
	private List<Treatment> treatments;

	public List<Treatment> getTreatments() {
		return treatments;
	}

	protected void setTreatments(List<Treatment> treatments) {
		this.treatments = treatments;
	}

	public void addTreatment(Treatment treatment) {
		this.treatments.add(treatment);
	}

	/*
	 * Addition and deletion of treatments should be done here.
	 */

	public Provider() {
		super();
		/*
		 * TODO initialize lists
		 */
		this.treatments = new ArrayList<Treatment>();
	}

	/*
	 * We will add aggregate methods later.
	 */

}
