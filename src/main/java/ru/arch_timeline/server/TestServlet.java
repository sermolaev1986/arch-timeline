package ru.arch_timeline.server;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.gson.Gson;

import javax.servlet.ServletException;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Date;


public class TestServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Gson obj = new Gson();

        resp.setContentType("text/plain");
        resp.setHeader("Cache-Control", "no-cache");

        PrintWriter pw = resp.getWriter();
        pw.write ( obj.toJson("hello world")) ;

        pw.flush();
        pw.close();

    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        DatastoreService service =  DatastoreServiceFactory.getDatastoreService();
        Entity entity = new Entity("ArchEvent");
        entity.setProperty("eventDate", new Date());
        entity.setProperty("eventTitle", "myTitle");

        service.put(entity);
    }
}
