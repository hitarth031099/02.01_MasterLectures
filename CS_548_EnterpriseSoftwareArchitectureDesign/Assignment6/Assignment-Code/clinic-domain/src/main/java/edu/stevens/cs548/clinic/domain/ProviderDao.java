package edu.stevens.cs548.clinic.domain;

import java.util.List;
import java.util.UUID;
import java.util.logging.Logger;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.persistence.*;
import javax.transaction.Transactional;

import edu.stevens.cs548.clinic.domain.ClinicDomainProducer.ClinicDomain;
import edu.stevens.cs548.clinic.domain.IPatientDao.PatientExn;

// TODO
//@RequestScoped
@Transactional
public class ProviderDao implements IProviderDao {

	// TODO
	@Inject 
	@ClinicDomain
	private EntityManager em;
	
	// TODO
	@Inject
	private ITreatmentDao treatmentDao;

	private Logger logger = Logger.getLogger(ProviderDao.class.getCanonicalName());

	@Override
	public void addProvider(Provider provider) throws ProviderExn {
		/*
		 * TODO add to database (and sync with database to generate primary key).
		 * Don't forget to initialize the Provider aggregate with a treatment DAO.
		 */
		UUID pid = provider.getProviderId();
		Query query = em.createNamedQuery("CountProviderByProviderId").setParameter("providerId", pid);
		Long numExisting = (Long) query.getSingleResult();
		
		if (numExisting < 1) {
			
			// TODO add to database, and initialize the patient aggregate with a treatment DAO.
			provider.setTreatmentDao(treatmentDao);
			em.persist(provider);
			
		} else {			
			throw new ProviderExn("Insertion: Provider with patient id (" + pid + ") already exists.");
		}
	}

	@Override
	/*
	 * The boolean flag indicates if related treatments should be loaded eagerly.
	 */
	public Provider getProvider(UUID id, boolean includeTreatments) throws ProviderExn {
		/*
		 * TODO retrieve Provider using external key
		 */
		String queryName = "SearchProviderByProviderId";
		TypedQuery<Provider> query = em.createNamedQuery(queryName, Provider.class).setParameter("providerId",id);
		List<Provider> providers = query.getResultList();
		
		if (providers.size() > 1) {
			throw new ProviderExn("Duplicate provider records: provider id = " + id);
		} else if (providers.size() < 1) {
			throw new ProviderExn("Provider not found: provider id = " + id);
		} else {
			Provider p = providers.get(0);
			/*
			 * Refresh from database or we will never see new treatments.
			 */
			em.refresh(p);
			p.setTreatmentDao(this.treatmentDao);
			return p;
		}
	}
	
	@Override
	/*
	 * By default, we eagerly load related treatments with a provider record.
	 */
	public Provider getProvider(UUID id) throws ProviderExn {
		return getProvider(id, true);
	}
	
	@Override
	public List<Provider> getProviders() {
		/*
		 * TODO Return a list of all providers (remember to set treatmentDAO)
		 */
		TypedQuery<Provider> query = em.createNamedQuery("SearchAllProviders", Provider.class);
		List<Provider> providers = query.getResultList();
		
		for (Provider p : providers) {
			p.setTreatmentDao(treatmentDao);
		}

		return providers;
	}
	
	@Override
	public void deleteProviders() {
		Query update = em.createNamedQuery("RemoveAllTreatments");
		update.executeUpdate();
		update = em.createNamedQuery("RemoveAllProviders");
		update.executeUpdate();
	}

}
