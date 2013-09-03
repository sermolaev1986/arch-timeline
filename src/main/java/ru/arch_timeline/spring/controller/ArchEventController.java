package ru.arch_timeline.spring.controller;


import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import ru.arch_timeline.jpa.EMF;
import ru.arch_timeline.model.ArchEvent;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

@Controller
@RequestMapping("/events")
public class ArchEventController {

    private static final Logger log = Logger.getLogger(ArchEventController.class.getName());

    private static final String PAGE_COUNT = "PageCount";
    private static final String PAGE_SIZE = "PageSize";
    private static final String PAGE_NUM = "PageNum";

  /*  ArchEventService service;

    @Autowired
    public ArchEventController(ArchEventService service) {

        this.service = service;
    }*/


    @RequestMapping(value = "/first-page/{pageSize}", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public ArchEvent[] firstPage(@PathVariable int pageSize, HttpSession session) {

        EntityManager entityManager = EMF.get().createEntityManager();

        final CriteriaBuilder builder = entityManager.getCriteriaBuilder();

        final CriteriaQuery<Long> countQuery = builder.createQuery(Long.class);
        countQuery.select(builder.count(countQuery.from(ArchEvent.class)));
        final Long count = entityManager.createQuery(countQuery)
                .getSingleResult();

        long pageCount = (long) Math.ceil(count / pageSize);

        Integer pageNum = 0;

        session.setAttribute(PAGE_COUNT, pageCount);
        session.setAttribute(PAGE_SIZE, pageSize);
        session.setAttribute(PAGE_NUM, pageNum);

        TypedQuery<ArchEvent> typedQuery = entityManager.createQuery("SELECT i FROM ArchEvent AS i", ArchEvent.class);

        List<ArchEvent> results = new ArrayList<ArchEvent>();

            results.addAll(typedQuery.setFirstResult(pageNum * pageSize)
                    .setMaxResults(pageSize)
                    .getResultList());

        return results.toArray(new ArchEvent[results.size()]);
    }

    @RequestMapping(value = "/create", method = RequestMethod.POST)
    @ResponseStatus(value = HttpStatus.NO_CONTENT)
    public void create(@RequestBody ArchEvent archEvent) {

        EntityManager entityManager = EMF.get().createEntityManager();

        entityManager.persist(archEvent);
        entityManager.close();

    }


    @RequestMapping(value = "/next-page", method = RequestMethod.GET)
    @ResponseBody
    public ArchEvent[] nextPage(HttpSession session) {

        Long pageCount = (Long) session.getAttribute(PAGE_COUNT);

        Integer pageNum = (Integer) session.getAttribute(PAGE_NUM);

        if (pageNum++ > pageCount - 1)  {
            return null;
        }

        session.setAttribute(PAGE_NUM,pageNum);

        Integer pageSize = (Integer) session.getAttribute(PAGE_SIZE);

        EntityManager entityManager = EMF.get().createEntityManager();

        TypedQuery<ArchEvent> typedQuery = entityManager.createQuery("SELECT i FROM ArchEvent AS i", ArchEvent.class);

        List<ArchEvent> results = new ArrayList<ArchEvent>();

        results.addAll(typedQuery.setFirstResult(pageNum * pageSize)
                .setMaxResults(pageSize)
                .getResultList());

        return results.toArray(new ArchEvent[results.size()]);

    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ResponseBody
    public String handleServerErrors(Exception ex) {
        log.log(Level.SEVERE, ex.getMessage(), ex);
        return ex.getMessage();
    }


}
