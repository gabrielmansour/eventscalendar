class Event < ActiveRecord::Base
  has_event_calendar :start_at_field  => :dtstart, :end_at_field => :dtend
  
  def to_s
    summary
  end

  def tooltip
    "(#{dtstart.to_s(:time)}) #{summary}"
  end
end