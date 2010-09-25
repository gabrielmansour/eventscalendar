class Event < ActiveRecord::Base
  has_event_calendar :start_at_field  => :dtstart, :end_at_field => :dtend
  
  attr_accessor :venue_name
  
  def to_s
    summary
  end
  
  def dtstart_date
    dtstart.try(:to_date)
  end
  
  def dtstart_time
    dtstart
  end
  
  def dtend_date
    dtend.try(:to_date)
  end
  
  def dtend_time
    dtend
  end

  def tooltip
    "(#{dtstart.to_s(:time)}) #{summary}"
  end
end