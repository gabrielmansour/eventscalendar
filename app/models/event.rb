class Event < ActiveRecord::Base
  has_event_calendar :start_at_field  => :dtstart, :end_at_field => :dtend
end