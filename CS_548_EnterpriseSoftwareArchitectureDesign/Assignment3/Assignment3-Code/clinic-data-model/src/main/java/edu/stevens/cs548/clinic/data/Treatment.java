package edu.stevens.cs548.clinic.data;

import java.io.Serializable;
import java.util.UUID;

import javax.persistence.*;

import org.eclipse.persistence.annotations.Convert;

/**
 * Entity implementation class for Entity: Treatment
 *
 */
@NamedQueries({
	@NamedQuery(
		name="SearchTreatmentByTreatmentId",
		query="select t from Treatment t where t.treatmentId = :treatmentId"),
	@NamedQuery(
			name = "SearchTreatmentListByTreatmentId", 
			query = "select t from Treatment t where t.treatmentId in ?treatmentIdList"),
	@NamedQuery(
			name="CountTreatmentByTreatmentId",
			query="select count(t) from Treatment t where t.treatmentId = :treatmentId"),
	@NamedQuery(
		name = "RemoveAllTreatments", 
		query = "delete from Treatment t")
})

// TODO
@Entity
@Table(name = "Treatment", indexes = @Index(columnList="treatmentId"))
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "Type")
public abstract class Treatment implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	// TODO PK
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	protected long id;
	
	@Convert("uuidConverter")
	@Column(nullable=false,unique=true)
	protected UUID treatmentId;
	
	protected String diagnosis;
	
	
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}
	
	public UUID getTreatmentId() {
		return treatmentId;
	}

	public void setTreatmentId(UUID treatmentId) {
		this.treatmentId = treatmentId;
	}

	public String getDiagnosis() {
		return diagnosis;
	}

	public void setDiagnosis(String diagnosis) {
		this.diagnosis = diagnosis;
	}

	/*
	 * TODO
	 */
	@ManyToOne
	private Patient patient;

	public Patient getPatient() {
		return patient;
	}

	public void setPatient(Patient patient) {
		this.patient = patient;
		// More logic in the domain model.
	}

	/*
	 * TODO
	 */
	@ManyToOne
	private Provider provider;

	public Provider getProvider() {
		return provider;
	}

	public void setProvider(Provider provider) {
		this.provider = provider;
		// More logic in the domain model.
	}	
	public Treatment() {
		super();
	}
   
}
