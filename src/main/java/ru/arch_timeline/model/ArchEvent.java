package ru.arch_timeline.model;


import com.google.appengine.api.datastore.Blob;
import org.codehaus.jackson.map.annotate.JsonSerialize;
import ru.arch_timeline.json.CustomDateSerializer;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.util.Date;

@Entity
public class ArchEvent {

    public Long getKey() {
        return key;
    }

    @JsonSerialize(using = CustomDateSerializer.class)
    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long key;


    private Date date;

    private String title;

    private String description;

    private Blob thumbnail;

    public byte[] getThumbnail() {
        return thumbnail.getBytes();
    }

    public void setThumbnail(byte[] bytes) {
        this.thumbnail = new Blob(bytes);
    }
}
