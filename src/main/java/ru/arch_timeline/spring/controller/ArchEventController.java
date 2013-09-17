package ru.arch_timeline.spring.controller;


import org.apache.commons.fileupload.FileItemIterator;
import org.apache.commons.fileupload.FileItemStream;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.fileupload.util.Streams;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.multipart.commons.CommonsMultipartFile;
import ru.arch_timeline.jpa.EMF;
import ru.arch_timeline.model.ArchEvent;
import ru.arch_timeline.model.ResultPage;

import javax.persistence.EntityManager;
import javax.persistence.TemporalType;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;
import java.util.logging.Level;
import java.util.logging.Logger;

@Controller
@RequestMapping("/events")
public class ArchEventController {

    private static final Logger log = Logger.getLogger(ArchEventController.class.getName());

    private static SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

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

    @RequestMapping(value = "/previous-page/{pageSize}", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public ResultPage previousPage(@PathVariable int pageSize, @RequestParam String dateString) throws ParseException {

        EntityManager entityManager = EMF.get().createEntityManager();

        TypedQuery<Long> countQuery = entityManager.createQuery("SELECT COUNT(i) FROM ArchEvent AS i WHERE i.date <= :date ", Long.class);

        Long count = countQuery.setParameter("date", dateFormat.parse(dateString), TemporalType.DATE).getSingleResult();

        TypedQuery<ArchEvent> typedQuery = entityManager.createQuery("SELECT i FROM ArchEvent AS i WHERE i.date <= :date ORDER BY i.date DESC", ArchEvent.class);

        List<ArchEvent> results = new ArrayList<ArchEvent>();

        results.addAll(typedQuery.setFirstResult(0)
                .setMaxResults(pageSize)
                .setParameter("date", dateFormat.parse(dateString), TemporalType.DATE)
                .getResultList());

        ArchEvent[] events = results.toArray(new ArchEvent[results.size()]);
        boolean isLast = count <= pageSize;

        return new ResultPage(isLast,events);
    }

    @RequestMapping(value = "/next-page/{pageSize}", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public ResultPage nextPage(@PathVariable int pageSize, @RequestParam String dateString) throws ParseException {

        EntityManager entityManager = EMF.get().createEntityManager();

        TypedQuery<Long> countQuery = entityManager.createQuery("SELECT COUNT(i) FROM ArchEvent AS i WHERE i.date >= :date ", Long.class);

        Long count = countQuery.setParameter("date", dateFormat.parse(dateString), TemporalType.DATE).getSingleResult();

        TypedQuery<ArchEvent> typedQuery = entityManager.createQuery("SELECT i FROM ArchEvent AS i WHERE i.date >= :date ORDER BY i.date ASC", ArchEvent.class);

        List<ArchEvent> results = new ArrayList<ArchEvent>();

        results.addAll(typedQuery.setFirstResult(0)
                .setMaxResults(pageSize)
                .setParameter("date", dateFormat.parse(dateString), TemporalType.DATE)
                .getResultList());

        ArchEvent[] events = results.toArray(new ArchEvent[results.size()]);
        boolean isLast = count <= pageSize;
        return new ResultPage(isLast,events);
    }

    @RequestMapping(value = "/create", method = RequestMethod.POST)
    @ResponseStatus(value = HttpStatus.NO_CONTENT)
    public void create(MultipartHttpServletRequest request) throws IOException, ParseException {

        EntityManager entityManager = EMF.get().createEntityManager();

        ArchEvent archEvent = new ArchEvent();

        String title = request.getParameter("title");
        archEvent.setTitle(title);

        String date = request.getParameter("date");
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
        archEvent.setDate(simpleDateFormat.parse(date));

        String description = request.getParameter("description");
        archEvent.setDescription(description);

        String tag = request.getParameter("tag");


        MultipartFile file = request.getFile("file");
        archEvent.setThumbnail(file.getBytes());


        entityManager.persist(archEvent);

        entityManager.close();

    }


    /*@RequestMapping(value = "/next-page", method = RequestMethod.GET)
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

    }*/

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ResponseBody
    public String handleServerErrors(Exception ex) {
        log.log(Level.SEVERE, ex.getMessage(), ex);
        return ex.getMessage();
    }


}
